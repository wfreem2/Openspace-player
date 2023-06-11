import { Component, ElementRef, forwardRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { map, of, Subject, switchMap, takeUntil } from 'rxjs'
import { isElementOrChildClicked } from 'src/app/Utils/utils'
import { BaseComponent } from '../base/base.component'
import { SortingType } from '../sorting-selector/sorting-selector.component'

@Component({
	selector: 'dropdown',
	templateUrl: './dropdown.component.html',
	styleUrls: ['./dropdown.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			multi: true,
			useExisting: forwardRef(() => DropdownComponent)
		}
	]
})
export class DropdownComponent extends BaseComponent implements OnInit, OnDestroy, ControlValueAccessor {
	@Input() items!: any[]

	onChange: any = () => {}
	onTouch: any = () => {}

	filteredSelectableItems: SelectableItem[] = []
	selectableItems: SelectableItem[] = []
	selectedItem!: SelectableItem

	isCollapsed: boolean = true
	isTouched: boolean = false
	isDisabled: boolean = false

	query = new Subject<string>()

	constructor(private hostRef: ElementRef, private render: Renderer2) {
		super()

		render.listen('window', 'click', this.onHostClick.bind(this))
		this.query
			.asObservable()
			.pipe(
				takeUntil(this.$unsub),
				map((query) => query.toLowerCase()),
				switchMap((query) => of(this.search(query)))
			)
			.subscribe((items) => (this.filteredSelectableItems = items))
	}

	private onHostClick(event: Event) {
		const hostClicked = isElementOrChildClicked(this.hostRef.nativeElement, event.target as HTMLElement)

		if (!hostClicked) {
			this.isCollapsed = true
		}
	}

	ngOnInit(): void {
		this.selectableItems = this.items.map((i) => {
			return { item: i, isSelected: false }
		})

		this.onDefaultNotProvided()
		this.filteredSelectableItems = [...this.selectableItems]
	}

	writeValue(obj: any): void {
		if (!obj) {
			this.onDefaultNotProvided()
			this.onChange(this.selectedItem.item)
		} else {
			this.setItem(obj)
		}
	}

	registerOnChange(fn: any): void {
		this.onChange = fn
	}
	registerOnTouched(fn: any): void {
		this.onTouch = fn
	}
	setDisabledState?(isDisabled: boolean): void {
		this.isDisabled = isDisabled
	}

	private search(query: any): SelectableItem[] {
		return this.selectableItems.filter((i) => i.item.toString().toLowerCase().includes(query))
	}

	selectItem(item: SelectableItem): void {
		this.selectedItem.isSelected = false

		this.selectedItem = item
		this.selectedItem.isSelected = true

		this.onChange(item.item)

		if (!this.isTouched) {
			this.onTouch(item.item)
			this.isTouched = true
		}

		this.isCollapsed = true
	}

	private setItem(item: any): void {
		const selectableItem = this.selectableItems.find((i) => i.item === item)

		if (selectableItem) {
			if (this.selectedItem) {
				this.selectedItem.isSelected = false
			}

			selectableItem.isSelected = true
			this.selectedItem = selectableItem
		} else {
			throw new Error(`Provided item: ${item} does not exist`)
		}
	}

	onSortSelected(sortingType: SortingType): void {
		if (sortingType === SortingType.None) {
			this.filteredSelectableItems = [...this.selectableItems]
			return
		}

		this.filteredSelectableItems.sort(this.sortFn(sortingType))
	}

	moveToTop(item: SelectableItem) {
		this.filteredSelectableItems = this.selectableItems.filter((i) => i !== item)
		this.filteredSelectableItems.unshift(item)
	}

	private onDefaultNotProvided(): void {
		//Set the first item as selected by default
		this.selectedItem = this.selectableItems[0]
		this.selectedItem.isSelected = true
	}

	private sortFn(type: SortingType) {
		if (type === SortingType.Ascending) {
			return (a: SelectableItem, b: SelectableItem) => {
				if (a.item.toString() < b.item.toString()) {
					return -1
				}
				if (a.item.toString() > b.item.toString()) {
					return 1
				}
				return 0
			}
		}

		return (a: SelectableItem, b: SelectableItem) => {
			if (a.item.toString() < b.item.toString()) {
				return 1
			}

			if (a.item.toString() > b.item.toString()) {
				return -1
			}

			return 0
		}
	}
}

type SelectableItem = { item: any; isSelected: boolean }
