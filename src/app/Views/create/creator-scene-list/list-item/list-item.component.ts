import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { Scene } from 'src/app/Interfaces/Scene';
import { isChildClicked } from 'src/app/Utils/utils';

@Component({
  selector: 'list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent implements OnInit {

  @ViewChild('m') more!: ElementRef

  @Input() isActive: boolean = false
  @Input() scene!: Scene

  @Output() itemClickedEvent = new EventEmitter<ListItemComponent>()
  @Output() deleteClickedEvent = new EventEmitter<ListItemComponent>()

  isCtxShowing: boolean = false

  constructor(private renderer: Renderer2) {
    this.renderer.listen('window', 'click', this.ctxMenuClicked.bind(this))
  } 
  

  ngOnInit(): void { }

  private ctxMenuClicked(event: Event){
    const isMoreClicked = isChildClicked(this.more.nativeElement, event.target)

    if(!isMoreClicked){
      this.isCtxShowing = false
    }

  } 

  onDeleteClicked(): void{
    this.deleteClickedEvent.emit(this)
  }
}
