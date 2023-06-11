import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core'
import { ControlValueAccessor, FormArray, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms'
import {
	BehaviorSubject,
	combineLatest,
	map,
	Observable,
	of,
	Subject,
	switchMap,
	takeUntil,
	withLatestFrom
} from 'rxjs'
import { SceneOptions } from 'src/app/Models/SceneOptions'
import { SceneOptionsForm, TrailOptionsForm } from 'src/app/Models/ShowForm'
import { SceneGraphNode } from 'src/app/Services/openspace.service'
import { BaseComponent } from 'src/app/Shared/base/base.component'
import { SortingType } from 'src/app/Shared/sorting-selector/sorting-selector.component'
import { toggleClass } from 'src/app/Utils/utils'

@Component({
	selector: 'scene-options',
	templateUrl: './scene-options.component.html',
	styleUrls: ['./scene-options.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: SceneOptionsComponent,
			multi: true
		}
	]
})
export class SceneOptionsComponent extends BaseComponent implements OnInit, OnDestroy, ControlValueAccessor {
	@ViewChildren('sortOpt') sortOptions!: QueryList<ElementRef>
	@ViewChild('filter') filterMenu!: ElementRef
	@ViewChild('filterBtn') filterBtn!: ElementRef

	onChange: any = () => {}
	onTouch: any = () => {}

	private touched: boolean = false
	private disabled: boolean = false

	sceneOptions!: SceneOptions

	_$selectAll = new Subject<void>()
	_$deselectAll = new Subject<void>()

	query = new BehaviorSubject<string>('')
	$currSorting = new BehaviorSubject<SortingType>(SortingType.None)
	_filteredTrails = new BehaviorSubject<FormGroup<TrailOptionsForm>[]>([])

	$filteredTrails!: Observable<FormGroup<TrailOptionsForm>[]>

	optionsForm = new FormGroup<SceneOptionsForm>({
		keepCameraPosition: new FormControl<boolean>(true, { nonNullable: true }),
		enabledTrails: new FormArray<FormGroup<TrailOptionsForm>>([])
	})

	constructor() {
		super()

		this.initFormGroup()

		this.$currSorting
			.asObservable()
			.pipe(takeUntil(this.$unsub))
			.subscribe((sorting) => this.sort(sorting))

		this.$filteredTrails = combineLatest([this._filteredTrails, this.query]).pipe(
			takeUntil(this.$unsub),
			switchMap(([ctrls, query]) => of(this.search(query.toLowerCase(), ctrls))),
			map((ctrls) => [...ctrls] as FormGroup<TrailOptionsForm>[]) //Deep copy to not affect original list
		)

		this._$selectAll
			.asObservable()
			.pipe(takeUntil(this.$unsub), withLatestFrom(this.$filteredTrails))
			.subscribe(([, ctrls]) => this.selectAllTrails(ctrls))

		this._$deselectAll
			.asObservable()
			.pipe(takeUntil(this.$unsub), withLatestFrom(this.$filteredTrails))
			.subscribe(([, ctrls]) => this.deselectAllTrails(ctrls))

		this.optionsForm.valueChanges
			.pipe(
				takeUntil(this.$unsub),
				map((v) => {
					v.enabledTrails = v.enabledTrails?.filter((t) => t.isEnabled)
					return {
						keepCameraPosition: v.keepCameraPosition,
						enabledTrails: v.enabledTrails?.map((t) => t.trail)
					} as SceneOptions
				})
			)
			.subscribe((v) => {
				if (!this.touched) {
					this.touched = true
					this.onTouch(v)
				}

				this.onChange(v)
			})
	}

	private initFormGroup(): void {
		const { enabledTrails } = this.optionsForm.controls

		Object.keys(SceneGraphNode)
			.map((node) => {
				return { node: <SceneGraphNode>node, isEnabled: false }
			})
			.forEach((t) => {
				const group = new FormGroup<TrailOptionsForm>({
					trail: new FormControl(t.node, { nonNullable: true }),
					isEnabled: new FormControl(t.isEnabled, { nonNullable: true })
				})

				enabledTrails.push(group)
			})
	}

	ngOnInit(): void {}

	writeValue(obj: any): void {
		const options = obj as SceneOptions

		if (!this.instanceOfOptions(options)) {
			return
		}

		this.optionsForm.patchValue(
			{
				keepCameraPosition: options.keepCameraPosition
			},
			{ emitEvent: false }
		)

		this.deselectAllTrails(this._filteredTrails.getValue(), false)

		const { enabledTrails } = this.optionsForm.controls

		enabledTrails.controls.forEach((ctrl) => {
			const { value } = ctrl
			value.isEnabled = options.enabledTrails.find((trail) => value.trail === trail) ? true : value.isEnabled

			ctrl.patchValue({ isEnabled: value.isEnabled }, { emitEvent: false })
		})
	}

	registerOnChange(fn: any): void {
		this.onChange = fn
	}
	registerOnTouched(fn: any): void {
		this.onTouch = fn
	}
	setDisabledState?(isDisabled: boolean): void {
		this.disabled = isDisabled
	}

	private instanceOfOptions(obj: any): obj is SceneOptions {
		return 'enabledTrails' in obj && 'keepCameraPosition' in obj
	}

	sort(sorting: SortingType): void {
		let controls = this._filteredTrails.getValue()

		switch (sorting) {
			case SortingType.Ascending:
				controls.sort(this.sortFn)
				break

			case SortingType.Descending:
				controls.sort(this.sortFn).reverse()
				break

			case SortingType.None:
				controls = [...this.optionsForm.controls.enabledTrails.controls]
				break
		}

		this._filteredTrails.next(controls)
	}

	toggleClass(element: any): void {
		toggleClass(element, 'collapsed')
	}

	selectAllTrails(ctrls: FormGroup<TrailOptionsForm>[]): void {
		ctrls.forEach((t, idx) => {
			t.controls['isEnabled'].setValue(true, { emitEvent: idx === ctrls.length - 1 })
		})
	}

	deselectAllTrails(ctrls: FormGroup<TrailOptionsForm>[], emitEvent: boolean = true): void {
		ctrls.forEach((t, idx) => {
			t.controls['isEnabled'].setValue(false, { emitEvent: idx === ctrls.length - 1 && emitEvent })
		})
	}

	get SortingType() {
		return SortingType
	}

	private search(query: string, ctrls: FormGroup<TrailOptionsForm>[]): FormGroup[] {
		return ctrls.filter((value) => {
			const trail: SceneGraphNode = value.controls['trail'].value
			return trail.toLowerCase().includes(query)
		})
	}

	private sortFn(a: FormGroup<TrailOptionsForm>, b: FormGroup<TrailOptionsForm>): number {
		const firstVal = a.controls['trail'].value
		const secondVal = b.controls['trail'].value

		if (firstVal < secondVal) {
			return -1
		}
		if (firstVal > secondVal) {
			return 1
		}

		return 0
	}
}
