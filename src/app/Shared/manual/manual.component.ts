import { Component, EventEmitter, OnInit, Output } from '@angular/core'

@Component({
	selector: 'manual',
	templateUrl: './manual.component.html',
	styleUrls: ['./manual.component.scss']
})
export class ManualComponent implements OnInit {
	selectedEntry: number = 1
	@Output() closedEvent = new EventEmitter()

	constructor() {}

	ngOnInit(): void {}
}
