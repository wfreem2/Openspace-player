import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core'

@Directive({
	selector: '[clickedoutsideof]'
})
export class ClickedoutsideofDirective {
	@Output('onClickOutside') onClickOutside = new EventEmitter<HTMLElement>()

	constructor(private hostRef: ElementRef) {}

	@HostListener('document:click', ['$event.target'])
	onClicked(target: HTMLElement): void {
		if (!this.hostRef.nativeElement.contains(target)) {
			this.onClickOutside.emit(target)
		}
	}
}
