import { Component, EventEmitter, OnInit, Output } from '@angular/core'

@Component({
	selector: 'sorting-selector',
	templateUrl: './sorting-selector.component.html',
	styleUrls: ['./sorting-selector.component.scss']
})
export class SortingSelectorComponent implements OnInit {
	sortingType: SortingType = SortingType.None
	@Output() sortingChangedEvent = new EventEmitter<SortingType>()

	constructor() {}

	ngOnInit(): void {}

	toggleSorting() {
		switch (this.sortingType) {
			case SortingType.None:
				this.sortingType = SortingType.Ascending
				break

			case SortingType.Ascending:
				this.sortingType = SortingType.Descending
				break

			case SortingType.Descending:
				this.sortingType = SortingType.None
				break
		}

		this.sortingChangedEvent.emit(this.sortingType)
	}

	get SortingType() {
		return SortingType
	}
}

export enum SortingType {
	Ascending = 'asc',
	Descending = 'des',
	None = 'none'
}
