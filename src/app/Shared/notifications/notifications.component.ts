import { Component, OnInit } from '@angular/core'
import { ScaleInOut } from 'src/app/Animations/animations'
import { NotificationType, ToastNotifcation } from 'src/app/Models/ToastNotification'
import { NotificationService } from 'src/app/Services/notification.service'

@Component({
	selector: 'notifications',
	templateUrl: './notifications.component.html',
	styleUrls: ['./notifications.component.scss'],
	animations: [ScaleInOut]
})
export class NotificationsComponent implements OnInit {
	notis: ToastNotifcation[] = []

	constructor(private notiService: NotificationService) {
		this.notiService.notifications.subscribe((notis) => (this.notis = notis))
	}

	ngOnInit(): void {}

	remove(noti: ToastNotifcation) {
		this.notiService.removeNotification(noti)
	}

	get NotificationType() {
		return NotificationType
	}
}
