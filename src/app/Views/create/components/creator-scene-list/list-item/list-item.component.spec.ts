import { ComponentFixture, TestBed } from '@angular/core/testing'
import { getFakeScene } from 'src/app/Utils/test-utils'
import { ListItemComponent } from './list-item.component'

describe('List-Item Component', () => {
	let component: ListItemComponent
	let fixture: ComponentFixture<ListItemComponent>

	beforeEach(async () => {
		TestBed.configureTestingModule({
			declarations: [ListItemComponent]
		})
			.compileComponents()
			.then(() => {
				fixture = TestBed.createComponent(ListItemComponent)
				component = fixture.componentInstance
				component.scene = getFakeScene(1)

				fixture.detectChanges()
			})
	})

	it('#onDeleteClicked() should emit an event', () => {
		const spy = spyOn(component.deleteClickedEvent, 'emit')

		component.onDeleteClicked()
		fixture.detectChanges()

		expect(spy).toHaveBeenCalled()
		expect(component.isCtxShowing).toBeFalse()
	})

	it('#onItemClick() should emit an event', () => {
		const spy = spyOn(component.itemClickedEvent, 'emit')

		component.onItemClick()
		fixture.detectChanges()

		expect(spy).toHaveBeenCalled()
	})

	it('#onItemClick() should not emit an event when it is active', () => {
		const spy = spyOn(component.itemClickedEvent, 'emit')

		component.isActive = true
		component.onItemClick()
		fixture.detectChanges()

		expect(spy).not.toHaveBeenCalled()
	})

	it('#onDuplicateClicked() should emit an event', () => {
		const spy = spyOn(component.duplicateClickedEvent, 'emit')

		component.onDuplicateClicked()
		fixture.detectChanges()

		expect(spy).toHaveBeenCalled()
	})

	it('#onDuplicateClicked() should hide context menu ', () => {
		component.onDuplicateClicked()
		fixture.detectChanges()

		const native: HTMLElement = fixture.nativeElement
		const ctx = native.querySelector('ctx-menu')

		expect(component.isCtxShowing).toBeFalse()
		expect(ctx).toBeFalsy()
	})

	it('#onClickOutsideOf() should hide context menu', () => {
		const notInElement = document.createElement('p')

		component.onClickOutsideOf(notInElement)
		expect(component.isCtxShowing).toBeFalse()
	})
})
