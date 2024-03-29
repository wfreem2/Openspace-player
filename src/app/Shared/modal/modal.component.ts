import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

@Component({
	selector: 'modal',
	templateUrl: './modal.component.html',
	styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
	@Input() title: string = ''
	@Input() showCloseBtn: boolean = true

	@Output() closedEvent = new EventEmitter<void>()

	constructor() {}

	ngOnInit(): void {}
}
