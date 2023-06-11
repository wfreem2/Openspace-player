import { ComponentFixture, TestBed } from '@angular/core/testing'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ConfirmPopupComponent } from './confirm-popup.component'

describe('ConfirmPopupComponent', () => {
	let component: ConfirmPopupComponent
	let fixture: ComponentFixture<ConfirmPopupComponent>

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ConfirmPopupComponent],
			imports: [BrowserAnimationsModule]
		}).compileComponents()

		fixture = TestBed.createComponent(ConfirmPopupComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it('should create', () => {
		expect(component).toBeTruthy()
	})

	it('clicking cancel should emit event', () => {
		const cancelSpy = spyOn(component.cancelClickedEvent, 'emit')

		const el: HTMLElement = fixture.nativeElement
		const btn: HTMLButtonElement = el.querySelector('#cancel')!

		btn.click()
		fixture.detectChanges()

		expect(cancelSpy).toHaveBeenCalled()
	})

	it('clicking confirm should emit event', () => {
		const confirmSpy = spyOn(component.confirmClickedEvent, 'emit')

		const el: HTMLElement = fixture.nativeElement
		const btn: HTMLButtonElement = el.querySelector('#confirm')!

		btn.click()
		fixture.detectChanges()

		expect(confirmSpy).toHaveBeenCalled()
	})
})
