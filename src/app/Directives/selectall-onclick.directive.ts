import { Directive, ElementRef } from '@angular/core'

@Directive({
	selector: '[selectallOnclick]'
})
export class SelectallOnclickDirective {
	private readonly input: HTMLInputElement

	constructor({ nativeElement }: ElementRef) {
		this.input = nativeElement
		this.input.addEventListener('focus', () => this.input.select())
	}
}
