import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NonNullableFormBuilder, Validators } from '@angular/forms'
import {
	BehaviorSubject,
	filter,
	map,
	Subject,
	Subscription,
	takeUntil,
	catchError,
	throttleTime,
	tap,
	distinctUntilKeyChanged,
	distinctUntilChanged,
	of
} from 'rxjs'
import { GeoPosition } from 'src/app/Models/GeoPosition'
import { NavigationState } from 'src/app/Models/NavigationState'
import { GeoPosForm } from 'src/app/Models/ShowForm'
import { NotificationType } from 'src/app/Models/ToastNotification'
import { NotificationService } from 'src/app/Services/notification.service'
import { OpenspaceService, SceneGraphNode } from 'src/app/Services/openspace.service'
import { BaseComponent } from 'src/app/Shared/base/base.component'

@Component({
	selector: 'scene-position',
	templateUrl: './scene-position.component.html',
	styleUrls: ['./scene-position.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: ScenePositionComponent,
			multi: true
		}
	]
})
export class ScenePositionComponent
	extends BaseComponent
	implements OnInit, OnDestroy, OnChanges, ControlValueAccessor
{
	@Input() isAutoMode = false

	private readonly numRegex = /^-?\d*\.?\d*$/
	geoPosForm = this.fb.group<GeoPosForm>({
		alt: this.fb.control<number>(0.0, [Validators.required, Validators.pattern(this.numRegex)]),
		lat: this.fb.control<number>(0.0, [Validators.required, Validators.pattern(this.numRegex)]),
		long: this.fb.control<number>(0.0, [Validators.required, Validators.pattern(this.numRegex)]),
		node: this.fb.control<SceneGraphNode>(SceneGraphNode.Earth, Validators.required),
		timestamp: this.fb.control<string>(''),
		navState: this.fb.control<NavigationState | undefined>(undefined)
	})

	readonly pathNavOptions = Object.values(SceneGraphNode)

	private listener?: Subscription
	readonly $nodeCanHaveGeo = new Subject<boolean>()
	readonly $geoPos = new Subject<GeoPosition>()
	readonly $isAutoMode = new BehaviorSubject<boolean>(this.isAutoMode)

	readonly $isDisconnected = this.openSpaceService.isConnected().pipe(
		map((isConnected) => !isConnected),
		takeUntil(this.$unsub)
	)

	onChange: any = () => {}
	onTouch: any = () => {}

	constructor(
		private openSpaceService: OpenspaceService,
		private notiService: NotificationService,
		private fb: NonNullableFormBuilder
	) {
		super()

		this.$isAutoMode
			.asObservable()
			.pipe(takeUntil(this.$unsub))
			.subscribe((isAuto) => {
				this.isAutoMode = isAuto

				if (isAuto) {
					this.disableAllControls()
				} else {
					this.enableAllControls()
				}

				this.setGeoListener(isAuto)
			})

		this.$geoPos
			.asObservable()
			.pipe(
				distinctUntilChanged(),
				filter((geoPos) => !!geoPos),
				takeUntil(this.$unsub)
			)
			.subscribe(async (geoPos) => {
				this.geoPosForm.patchValue(
					{
						alt: geoPos.alt,
						lat: geoPos.lat,
						long: geoPos.long,
						node: geoPos.node,
						timestamp: geoPos.timestamp,
						navState: geoPos.navState
					},
					{ emitEvent: false }
				)
			})

		//Emitting boolean indicating nodes that can/cannot have a geoposition
		this.geoPosForm.valueChanges
			.pipe(distinctUntilKeyChanged('node'), takeUntil(this.$unsub))
			.subscribe(async ({ node }) => {
				if (node) {
					this.$nodeCanHaveGeo.next(await this.openSpaceService.nodeCanHaveGeo(node))
				}
			})

		//Notifications for nodes that can/cannot have a geoposition
		this.$geoPos
			.asObservable()
			.pipe(distinctUntilKeyChanged('node'), takeUntil(this.$unsub))
			.subscribe(async ({ node }) => {
				if (!node) {
					return
				}

				const canHaveGeo = await this.openSpaceService.nodeCanHaveGeo(node)

				if (!canHaveGeo) {
					this.notiService.showNotification({
						title: `${node} cannot have a Geo-Position.`,
						type: NotificationType.WARNING
					})
				}
			})

		//For nodes that can/cannot have a geoposition
		//Some form controls need to be disabled/re-enabled
		this.$nodeCanHaveGeo.pipe(takeUntil(this.$unsub)).subscribe({
			next: (canHaveGeoPosition) => {
				if (!canHaveGeoPosition) {
					this.geoPosForm.controls.alt.disable({ emitEvent: false })
					this.geoPosForm.controls.lat.disable({ emitEvent: false })
					this.geoPosForm.controls.long.disable({ emitEvent: false })

					const node = this.geoPosForm.controls.node.value

					this.notiService.showNotification({
						title: `${node} cannot have a Geo-Position.`,
						type: NotificationType.WARNING
					})

					this.geoPosForm.patchValue({
						alt: 0,
						lat: 0,
						long: 0
					})

					this.$isAutoMode.next(false)
					return
				}

				//If not in autoMode re-enable controls.
				if (!this.isAutoMode) {
					this.geoPosForm.controls.alt.enable({ emitEvent: false })
					this.geoPosForm.controls.lat.enable({ emitEvent: false })
					this.geoPosForm.controls.long.enable({ emitEvent: false })
				}
			},
			error: () => console.log('error')
		})

		//Emitting values for parent form to consume
		this.geoPosForm.valueChanges
			.pipe(
				tap(async () => {
					try {
						const timestamp = await this.openSpaceService.getTime()
						this.geoPosForm.controls.timestamp.setValue(timestamp, { emitEvent: false })
					} catch {}
				}),
				catchError((val) => of(val)),
				filter(() => this.lat!.valid && this.long!.valid && this.alt!.valid),
				map(() => this.geoPosForm.getRawValue() as GeoPosition),
				takeUntil(this.$unsub)
			)
			.subscribe((v) => this.onChange(v))
	}

	ngOnInit(): void {}

	get alt() {
		return this.geoPosForm.get('alt')!
	}
	get lat() {
		return this.geoPosForm.get('lat')!
	}
	get long() {
		return this.geoPosForm.get('long')!
	}

	override ngOnDestroy(): void {
		super.ngOnDestroy()
		this.setGeoListener(false)
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['isAutoMode']) {
			const { currentValue } = changes['isAutoMode']
			this.$isAutoMode.next(currentValue)
		}
	}

	writeValue(obj: any): void {
		if (this.isinstanceofGeoPos(obj)) {
			this.$geoPos.next(obj)
		}
	}

	private isinstanceofGeoPos(obj: any): obj is GeoPosition {
		return 'lat' in obj && 'long' in obj && 'alt' in obj && 'node' in obj
	}

	registerOnChange(fn: any): void {
		this.onChange = fn
	}
	registerOnTouched(fn: any): void {
		this.onTouch = fn
	}
	setDisabledState?(isDisabled: boolean): void {}

	private async setGeoListener(isAuto: boolean) {
		if (!isAuto) {
			this.listener?.unsubscribe()
			return
		}

		this.disableAllControls()

		this.listener = this.openSpaceService
			.listenCurrentPosition()
			.pipe(
				catchError(() => {
					this.notiService.showNotification({
						title: 'Cannot enable auto mode, Openspace is disconnected',
						type: NotificationType.ERROR
					})

					this.$isAutoMode.next(false)
					this.enableAllControls()

					return this.$geoPos
				}),
				throttleTime(500)
			)
			.subscribe((pos) => {
				this.$geoPos.next(pos)
				this.onChange(pos)
			})
	}

	private enableAllControls(): void {
		Object.values(this.geoPosForm.controls).forEach((ctrl) => ctrl.enable({ emitEvent: false }))
	}

	private disableAllControls(): void {
		Object.values(this.geoPosForm.controls).forEach((ctrl) => ctrl.disable({ emitEvent: false }))
	}
}
