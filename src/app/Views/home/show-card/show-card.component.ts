import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core'
import { Show } from 'src/app/Models/Show'
import { ShowService } from 'src/app/Services/show.service'

@Component({
	selector: 'show-card',
	templateUrl: './show-card.component.html',
	styleUrls: ['./show-card.component.scss']
})
export class ShowCardComponent implements OnInit {
	@Input() active: boolean = false
	@Input() show!: Show
	@Output() cardClicked = new EventEmitter<Show>()

	constructor(private showService: ShowService) {}

	ngOnInit(): void {}

	@HostListener('click', ['$event'])
	onClick() {
		this.cardClicked.emit(this.show)
	}

	onChange(): void {
		this.showService.save(this.show)
	}
}
