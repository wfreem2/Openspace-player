import { Injectable } from '@angular/core'
import { filter, Subject } from 'rxjs'
import { Scene } from 'src/app/Models/Scene'

@Injectable({
	providedIn: 'root'
})
export class SelectedSceneService {
	private _scene = new Subject<Scene>()

	public $selectedScene = this._scene.asObservable().pipe(filter((s) => !!s))
	public $newSceneAdded = new Subject<void>()

	constructor() {}

	setScene(scene: Scene): void {
		this._scene.next(scene)
	}
}
