import {
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output,
	QueryList,
	ViewChildren
} from '@angular/core'
import { Scene } from 'src/app/Models/Scene'
import { ListItemComponent } from './list-item/list-item.component'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { filter, Observable, Subject } from 'rxjs'
import { BaseComponent } from 'src/app/Shared/base/base.component'
import { SceneIssue } from 'src/app/Models/SceneIssue'

@Component({
	selector: 'creator-scene-list',
	templateUrl: './creator-scene-list.component.html',
	styleUrls: ['./creator-scene-list.component.scss']
})
export class CreatorSceneListComponent extends BaseComponent implements OnInit, OnDestroy {
	@ViewChildren(ListItemComponent) items!: QueryList<ListItemComponent>

	query: string = ''

	@Input() $currentScene!: Subject<Scene | null>
	@Input() $sceneIssues!: Observable<SceneIssue[]>
	@Input() scenes!: Scene[]
	@Input('defaultScene') DEFAULT_SCENE: any

	@Output() deleteClickedEvent = new EventEmitter<Scene>()
	@Output() duplicateClickedEvent = new EventEmitter<Scene>()
	@Output() listDragDropEvent = new EventEmitter<Scene[]>()

	$currScene!: Observable<Scene | null>

	constructor(private cdRef: ChangeDetectorRef) {
		super()
	}

	ngOnInit(): void {
		this.$currScene = this.$currentScene.pipe(filter((scene) => !!scene))
	}

	newScene(): void {
		const id = this.scenes.reduce((a, b) => Math.max(a, b.id), 0) + 1

		const newScene: Scene = {
			id: id,
			...this.DEFAULT_SCENE
		}

		this.scenes.push(newScene)
		this.cdRef.detectChanges()
		this.$currentScene.next(newScene)
	}

	onDeleteClicked(scene: Scene): void {
		this.deleteClickedEvent.emit(scene)
	}

	onDuplicateClicked({ scene }: ListItemComponent): void {
		this.duplicateClickedEvent.emit(scene)
	}

	onDrop(event: CdkDragDrop<Scene[]>) {
		moveItemInArray(this.scenes, event.previousIndex, event.currentIndex)
		this.listDragDropEvent.emit(this.scenes)
	}

	isSceneInvalid(scenes: SceneIssue[] | null, scene: Scene) {
		if (scenes === null) {
			return false
		}

		return scenes.some((issue) => issue.scene.id === scene.id)
	}
}
