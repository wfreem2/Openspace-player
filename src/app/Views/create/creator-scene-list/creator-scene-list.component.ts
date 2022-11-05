import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { cloneDeep } from 'lodash';
import { Scene } from 'src/app/Interfaces/Scene';
import { SelectedSceneService } from '../selected-scene.service';
import { ListItemComponent } from './list-item/list-item.component';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { first, pipe } from 'rxjs';

@Component({
  selector: 'creator-scene-list',
  templateUrl: './creator-scene-list.component.html',
  styleUrls: ['./creator-scene-list.component.scss']
})

export class CreatorSceneListComponent implements OnInit{

  @ViewChildren(ListItemComponent) items!: QueryList<ListItemComponent>

  @Input() scenes!: Scene[]
  @Output() deleteClickedEvent = new EventEmitter<Scene>()
  @Output() listDragDropEvent = new EventEmitter()

  constructor(private selectedSceneService: SelectedSceneService,
    private cdRef : ChangeDetectorRef) { 
    this.selectedSceneService.$newSceneAdded
    .asObservable()
    .subscribe(_ => this.setAllInactive())
  }

  ngOnInit(): void { }

  onItemClicked(item: ListItemComponent): void{
    const { scene } = item
    this.items.forEach(i => i.isActive = false)

    item.isActive = true
    this.setScene(scene)
  }

  private setScene(scene: Scene){
    this.selectedSceneService.setScene(scene)
  }

  setAllInactive(): void{
    this.items.forEach(i => i.isActive = false)
  }

  onDuplicateClicked(item: ListItemComponent): void{
    const { scene } = item
    const duplicate: Scene = cloneDeep(scene)

    let id = 1
    let newTitle = duplicate.title + ' (copy)'
    let existingCopy = this.scenes.find(s => s.title === newTitle)

    /*
     While there is a scene with the same name (user duplicated already)
     increment a number to append behind the title to make it unique
    */
    while(existingCopy){
      newTitle = duplicate.title + ' (copy)' + `(${id++})`
      existingCopy = this.scenes.find(s => s.title === newTitle)
    }

    duplicate.title = newTitle
    duplicate.id += 1

    this.scenes.push(duplicate)
    this.setScene(duplicate)

    
    //Set the newest (duplicated) list item to active
    this.items.changes
    .pipe(first())
    .subscribe(c => {
      const activeItem = this.items.find(i => i.isActive)
      activeItem!.isActive = false
      
      const last: ListItemComponent = c.last
      last.isActive = true

      this.cdRef.detectChanges()
    })
  }

  onDrop(event: CdkDragDrop<Scene[]>){
    moveItemInArray(this.scenes, event.previousIndex, event.currentIndex)
    this.listDragDropEvent.emit()
  }
}