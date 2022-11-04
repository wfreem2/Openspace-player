import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { cloneDeep } from 'lodash';
import { Scene } from 'src/app/Interfaces/Scene';
import { SelectedSceneService } from '../selected-scene.service';
import { ListItemComponent } from './list-item/list-item.component';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'creator-scene-list',
  templateUrl: './creator-scene-list.component.html',
  styleUrls: ['./creator-scene-list.component.scss']
})

export class CreatorSceneListComponent implements OnInit{

  @ViewChildren(ListItemComponent) items!: QueryList<ListItemComponent>

  @Input() scenes!: Scene[]
  @Output() deleteClickedEvent = new EventEmitter<Scene>()

  constructor(private selectedSceneService: SelectedSceneService) { }

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
  }

  onDrop(event: CdkDragDrop<Scene[]>){
    moveItemInArray(this.scenes, event.previousIndex, event.currentIndex)
  }
}