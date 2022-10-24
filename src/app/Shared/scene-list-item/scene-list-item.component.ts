import { Component, ElementRef, Input, OnInit, Output, Renderer2, ViewChild, EventEmitter } from '@angular/core';
import { Scene } from 'src/app/Interfaces/Scene';

@Component({
  selector: 'scene-list-item',
  templateUrl: './scene-list-item.component.html',
  styleUrls: ['./scene-list-item.component.scss']
})
export class SceneListItemComponent implements OnInit {

  isCollapsed:boolean = false
  isSelected:boolean = true
  showCtxMenu:boolean = false

  @Input() readonly!: boolean
  @Input() scene!: Scene
  @ViewChild('ctx') ctxMenu?: ElementRef;
  @ViewChild('m') more!: ElementRef;

  @Output() editClickedEvent = new EventEmitter<Scene>()
  @Output() deleteClickedEvent = new EventEmitter<Scene>()

  constructor(private renderer: Renderer2) { } 
  
  ngOnInit(): void { 
    if(!this.readonly){
      this.renderer.listen('window', 'click', this.ctxMenuClickOutsideOf.bind(this))
    }
  }

  private ctxMenuClickOutsideOf(e: Event){
    const svgClicked = this.isChildClicked(this.more.nativeElement, e.target)

    if(svgClicked){ return }

    if(this.ctxMenu){
      const ctxMenuClicked = this.isChildClicked(this.ctxMenu.nativeElement, e.target)
      if(!ctxMenuClicked){ this.showCtxMenu = false }
    }
  }


  private isChildClicked(e: HTMLElement, clickedElement: EventTarget | null): boolean{
    
    if(e === clickedElement){ return true }
    
    for(var i = 0; i < e.childNodes.length; i++){
      let c = e.childNodes[i]

      if(this.isChildClicked(<HTMLElement> c, clickedElement)) 
        return true 
    }
    
    return false
  }

}
