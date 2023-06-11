import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ScaleInOut } from 'src/app/Animations/animations'
import { Scene } from 'src/app/Models/Scene'

@Component({
	selector: 'scene-list',
	templateUrl: './scene-list.component.html',
	styleUrls: ['./scene-list.component.scss'],
	animations: [ScaleInOut]
})
export class SceneListComponent implements OnInit {
	@Input() scenes: Scene[] = []

	@Input() isReadOnly: boolean = false

	@Output() editSceneClicked = new EventEmitter<Scene>()
	@Output() deleteSceneClicked = new EventEmitter<Scene>()

	constructor() {}

	ngOnInit(): void {}
}
