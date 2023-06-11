import { Component } from '@angular/core'
import { Router, Event as NavigationEvent, NavigationEnd } from '@angular/router'

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'openspace-player'

	isNavShowing: boolean = true

	constructor(router: Router) {
		router.events.subscribe((ev: NavigationEvent) => {
			if (ev instanceof NavigationEnd) {
				this.isNavShowing = !ev.url.includes('creator')
			}
		})
	}
}
