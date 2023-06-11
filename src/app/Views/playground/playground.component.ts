import { Component, OnInit } from '@angular/core'
import { SceneGraphNode } from 'src/app/Services/openspace.service'

@Component({
	selector: 'app-playground',
	templateUrl: './playground.component.html',
	styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent implements OnInit {
	pathNavOptions: SceneGraphNode[] = []

	constructor() {
		this.pathNavOptions = Object.values(SceneGraphNode)
	}

	ngOnInit(): void {}
}
