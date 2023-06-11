import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { fromEvent, takeUntil, filter, tap, Observable, first } from 'rxjs'
import { CreatorMenuItem, CreatorSubMenuItem } from 'src/app/Models/CreatorMenuItem'
import { BaseComponent } from 'src/app/Shared/base/base.component'
import * as keycode from 'keycode'

@Component({
	selector: 'creator-menu',
	templateUrl: './creator-menu.component.html',
	styleUrls: ['./creator-menu.component.scss']
})
export class CreatorMenuComponent extends BaseComponent implements OnInit {
	@Input() menuItems: CreatorMenuItem[] = []

	items!: { menuItem: CreatorMenuItem; isShowing: boolean }[]
	keyBindings: { menu: CreatorSubMenuItem; key: string }[] = []

	constructor() {
		super()
	}

	ngOnInit(): void {
		this.items = this.menuItems.map((item) => {
			return { isShowing: false, menuItem: item }
		})

		this.keyBindings = this.menuItems
			.flatMap((item) => item.subMenus)
			.flatMap((subMenu) => {
				return {
					key: subMenu.hotKey.slice(0)[0].toLowerCase(),
					menu: subMenu
				}
			})

		fromEvent<KeyboardEvent>(document, 'keydown')
			.pipe(
				filter((ev) => {
					//Only if there is a keybinding that exists for the pressed keys
					return ev.ctrlKey && this.keyBindings.some(({ key }) => keycode(ev) === key)
				}),
				tap((ev) => ev.preventDefault()),
				takeUntil(this.$unsub)
			)
			.subscribe(this.keyPressHandler.bind(this))
	}

	private keyPressHandler(e: KeyboardEvent) {
		const { menu } = this.keyBindings.find(({ key }) => key === keycode(e))!

		if (menu.isDisabled instanceof Observable<boolean>) {
			menu.isDisabled.pipe(first()).subscribe((isDisabled) => {
				if (!isDisabled) {
					menu.callBack()
				}
			})

			return
		}

		if (!menu.isDisabled) {
			menu.callBack()
		}
	}
}
