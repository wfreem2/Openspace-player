import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ScaleInOut } from 'src/app/Animations/animations'

@Component({
	selector: 'confirm-popup',
	templateUrl: './confirm-popup.component.html',
	styleUrls: ['./confirm-popup.component.scss'],
	animations: [ScaleInOut]
})
export class ConfirmPopupComponent implements OnInit {
	@Input() prompt!: string

	@Output() cancelClickedEvent = new EventEmitter()
	@Output() confirmClickedEvent = new EventEmitter()

	constructor() {}

	ngOnInit(): void {}

	onCancel(): void {
		this.cancelClickedEvent.emit()
	}

	onConfirm(): void {
		this.confirmClickedEvent.emit()
	}
}
