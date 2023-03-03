import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { cloneDeep } from 'lodash';
import { Scene } from 'src/app/Models/Scene';
import { ListItemComponent } from './list-item/list-item.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { filter, ReplaySubject, Subject, tap } from 'rxjs';
import { BaseComponent } from 'src/app/Shared/base/base.component';

@Component({
  selector: 'creator-scene-list',
  templateUrl: './creator-scene-list.component.html',
  styleUrls: ['./creator-scene-list.component.scss']
})

export class CreatorSceneListComponent extends BaseComponent implements OnInit, OnDestroy{

  @ViewChildren(ListItemComponent) items!: QueryList<ListItemComponent>

  query: string = ''

  @Input() scenes!: Scene[]
  @Input('defaultScene') DEFAULT_SCENE: any

  @Output() deleteClickedEvent = new EventEmitter<Scene>()
  @Output() duplicateClickedEvent = new EventEmitter<Scene>()
  @Output() itemClickedEvent = new EventEmitter<Scene>()
  @Output() listDragDropEvent = new EventEmitter<Scene[]>()

  $setScene = new ReplaySubject<Scene>()

  $currScene = this.$setScene
  .pipe( 
    filter(scene => !!scene),
    tap( scene => this.itemClickedEvent.emit(scene) )
  )
  
  constructor(private cdRef : ChangeDetectorRef) { super() }

  ngOnInit(): void { }

  newScene(): void{
    const id = this.scenes.reduce( (a, b) => Math.max(a, b.id), 0 ) + 1
    
    const newScene: Scene = {
      id: id,
      ...this.DEFAULT_SCENE
    }

    this.scenes.push(newScene)
    this.cdRef.detectChanges()
    this.$setScene.next(newScene)
  }


  onDeleteClicked(scene: Scene): void{
    this.deleteClickedEvent.emit(scene)
  }


  onDuplicateClicked(item: ListItemComponent): void{
    const { scene } = item
    const duplicate: Scene = cloneDeep(scene)

    let id = 1
    let newTitle = duplicate.title + ` (${id++})`
    let existingCopy = this.scenes.find(s => s.title === newTitle)

    /*
     While there is a scene with the same name (user duplicated already)
     increment a number to append behind the title to make it unique
    */
    while(!!existingCopy){
      newTitle = duplicate.title + ` (${id++})`
      existingCopy = this.scenes.find(s => s.title === newTitle)
    }

    duplicate.title = newTitle
    duplicate.id = this.scenes.reduce( (a, b) => Math.max(a, b.id), 1) + 1 
    
    this.duplicateClickedEvent.emit(duplicate)
    this.$setScene.next(duplicate)
  }

  onDrop(event: CdkDragDrop<Scene[]>){
    moveItemInArray(this.scenes, event.previousIndex, event.currentIndex)
    this.listDragDropEvent.emit(this.scenes)
  }
}