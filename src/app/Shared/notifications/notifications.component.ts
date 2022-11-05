import { Component, Input, OnInit } from '@angular/core';
import { ScaleInOut } from 'src/app/Animations/animations';
import { ToastNotifcation } from 'src/app/Interfaces/ToastNotification';
import { NotificationService } from 'src/app/Services/notification.service';

@Component({
  selector: 'notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  animations: [ScaleInOut]
})
export class NotificationsComponent implements OnInit {

  notis: ToastNotifcation[] = []

  constructor(private notiService: NotificationService) { 
    this.notiService.notifications
    .subscribe(notis => this.notis = notis)
  }

  ngOnInit(): void { }

  remove(noti: ToastNotifcation){
    this.notiService.removeNotification(noti)
  }

}
