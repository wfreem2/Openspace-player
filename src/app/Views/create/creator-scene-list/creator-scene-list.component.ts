import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { cloneDeep } from 'lodash';
import { Scene } from 'src/app/Interfaces/Scene';
import { SelectedSceneService } from '../selected-scene.service';
import { ListItemComponent } from './list-item/list-item.component';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { map, mergeMap, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'creator-scene-list',
  templateUrl: './creator-scene-list.component.html',
  styleUrls: ['./creator-scene-list.component.scss']
})

export class CreatorSceneListComponent implements OnInit, AfterViewInit, OnDestroy{

  @ViewChildren(ListItemComponent) items!: QueryList<ListItemComponent>


  @Input() scenes!: Scene[]
  @Output() deleteClickedEvent = new EventEmitter<Scene>()
  @Output() duplicateClickedEvent = new EventEmitter<Scene[]>()
  @Output() listDragDropEvent = new EventEmitter<Scene[]>()

  private $unsub = new Subject<void>()

  constructor(private selectedSceneService: SelectedSceneService,
    private cdRef : ChangeDetectorRef) { }


  ngOnDestroy(): void { this.$unsub.next() }

  ngAfterViewInit(): void {
    this.selectedSceneService.$selectedScene
    .pipe(
      takeUntil(this.$unsub),
      mergeMap(s => 
        this.items.changes
        .pipe(map( () => this.items.find(i => i.scene === s) ))
      )
    )
    .subscribe(item => {
      this.setAllInactive()
      if(item){ item.isActive = true }
      this.cdRef.detectChanges()
    })
  }

  ngOnInit(): void { }

  onItemClicked(item: ListItemComponent): void{
    const { scene } = item
    this.items.forEach(i => i.isActive = false)

    item.isActive = true
    this.setScene(scene)
  }

  
  private setAllInactive(): void{
    this.items.forEach(i => i.isActive = false)
  }
  
  onDeleteClicked( {scene}: ListItemComponent): void{
    this.deleteClickedEvent.emit(scene)
  }
  
  private setScene(scene: Scene){
    this.selectedSceneService.setScene(scene)
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
    
    this.scenes.push(duplicate)
    this.setScene(duplicate)
    this.duplicateClickedEvent.emit(this.scenes)
  }

  onDrop(event: CdkDragDrop<Scene[]>){
    moveItemInArray(this.scenes, event.previousIndex, event.currentIndex)
    this.listDragDropEvent.emit(this.scenes)
  }
}