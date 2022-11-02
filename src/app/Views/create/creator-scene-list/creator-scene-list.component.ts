import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { Scene } from 'src/app/Interfaces/Scene';
import { SelectedSceneService } from '../selected-scene.service';
import { ListItemComponent } from './list-item/list-item.component';

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

  
/* 
  private ctxMenuClickOutsideOf(e: Event){
    const svgClicked = isChildClicked(this.more.nativeElement, e.target)

    if(svgClicked){ return }

    if(this.ctxMenu){
      const ctxMenuClicked = isChildClicked(this.ctxMenu.nativeElement, e.target)
      if(!ctxMenuClicked){ this.showCtxMenu = false }
    }
  } */
}
