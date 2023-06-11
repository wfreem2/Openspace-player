import { Component, OnDestroy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Subject } from 'rxjs'

@Component({
	standalone: true,
	imports: [CommonModule],
	template: '',
	styles: []
})
export class BaseComponent implements OnDestroy {
	protected $unsub = new Subject<void>()
	constructor() {}

	ngOnDestroy(): void {
		this.$unsub.next()
		this.$unsub.unsubscribe()
	}
}
