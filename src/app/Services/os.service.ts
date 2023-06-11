import { Injectable } from '@angular/core'

@Injectable({
	providedIn: 'root'
})
export class OsService {
	constructor() {}

	static get getCommandKey(): string {
		const isWindows = window.navigator.userAgent.includes('Win')

		return isWindows ? 'CTRL' : '⌘'
	}
}
