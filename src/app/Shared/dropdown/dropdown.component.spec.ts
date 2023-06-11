import { ElementRef, Renderer2 } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TablerIconComponent, TablerIconsModule } from 'angular-tabler-icons'
import { IconsModule } from 'src/app/icons.module'
import { testControlValueImplementation } from 'src/app/Utils/test-utils'
import { SortingSelectorComponent, SortingType } from '../sorting-selector/sorting-selector.component'
import { DropdownComponent } from './dropdown.component'

describe('Dropdown component', () => {
	const items = ['item1', 'item2', 'item3', 'item4']

	let fixture: ComponentFixture<DropdownComponent>
	let component: DropdownComponent

	beforeEach(async () => {
		TestBed.configureTestingModule({
			declarations: [DropdownComponent, SortingSelectorComponent, TablerIconComponent],
			providers: [{ provide: ElementRef, useClass: MockElementRef }, Renderer2],
			imports: [IconsModule, TablerIconsModule]
		})
			.compileComponents()
			.then(() => {
				fixture = TestBed.createComponent(DropdownComponent)
				component = fixture.componentInstance
				component.items = items
				fixture.detectChanges()
			})
	})

	it('#writeValue() should select passed in item', () => {
		const itemToSelect = items[3]

		component.writeValue(itemToSelect)
		fixture.detectChanges()
		expect(component.selectedItem.item).toEqual(itemToSelect)
	})

	it('should select first item as default when #writeValue() param is falsy', () => {
		const expectedItem = items[0]

		component.writeValue(null)

		expect(component.selectedItem.item).toEqual(expectedItem)
	})

	it('should throw error when writeValue paramater does not exist in items', () => {
		const nonExistentItem = 'i dont exist'

		const notExists = () => {
			component.writeValue(nonExistentItem)
			fixture.detectChanges()
		}

		expect(notExists).toThrow()
	})

	it('#selectItem() should select the provided item', () => {
		const toSelect = component.selectableItems.find((i) => i.item === items[3])

		component.selectItem(toSelect!)
		fixture.detectChanges()

		expect(toSelect).toEqual(component.selectedItem)
	})

	it('selected item should be moved to the top of the list', () => {
		const toSelect = component.selectableItems.find((i) => i.item === items[3])

		let header: HTMLElement = fixture.nativeElement.getElementsByClassName('header')[0]
		component.selectItem(toSelect!)
		fixture.detectChanges()

		header.click()

		expect(component.filteredSelectableItems[0]).toEqual(toSelect!)
	})

	it('#onSortSelected() should sort the items ascending with SortingType.Ascending', () => {
		const expected = [...component.filteredSelectableItems].sort()

		component.onSortSelected(SortingType.Ascending)
		fixture.detectChanges()

		expect(expected).toEqual(component.filteredSelectableItems)
	})

	it('#onSortSelected() should sort the items with SortingType.Descending', () => {
		const expected = [...component.filteredSelectableItems].sort().reverse()

		component.onSortSelected(SortingType.Descending)
		fixture.detectChanges()

		expect(expected).toEqual(component.filteredSelectableItems)
	})

	it('#onSortSelected() should not sort the items with SortingType.None', () => {
		const expected = [...component.filteredSelectableItems]

		component.onSortSelected(SortingType.None)
		fixture.detectChanges()

		expect(expected).toEqual(component.filteredSelectableItems)
	})

	it('filtered items should include search query', () => {
		;['Earth', 'EARTH', 'VeNuS'].forEach((query) => {
			component.query.next(query)
			fixture.detectChanges()

			expect(component.filteredSelectableItems.every((i) => i.item.includes(query))).toBeTrue()
		})
	})

	it('should properly implement ControlValueAccessor', () => testControlValueImplementation(component))

	it('empty search query should return entire list', () => {
		const query = ''

		component.query.next(query)
		fixture.detectChanges()

		expect(component.filteredSelectableItems).toEqual(component.selectableItems)
	})
})

export class MockElementRef extends ElementRef {}
