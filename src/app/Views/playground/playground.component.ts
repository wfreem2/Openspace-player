import { Component, OnInit } from '@angular/core';
import { NotificationType } from 'src/app/Interfaces/ToastNotification';
import { NotificationService } from 'src/app/Services/notification.service';
import { SceneGraphNode } from 'src/app/Services/openspace.service';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent implements OnInit {

  pathNavOptions: SceneGraphNode[] = []

  constructor(private notis: NotificationService) { 
    this.pathNavOptions = Object.values(SceneGraphNode)

    notis.showNotification({ title: 'Test', type: NotificationType.SUCCESS })
    notis.showNotification({ title: 'Test2', type: NotificationType.ERROR })
    notis.showNotification({ title: 'Test3', type: NotificationType.WARNING })
  }

  ngOnInit(): void { }

}
