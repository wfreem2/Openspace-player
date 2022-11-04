import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { Scene } from 'src/app/Interfaces/Scene';
import { isElementOrChildClicked } from 'src/app/Utils/utils';

@Component({
  selector: 'list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
})
export class ListItemComponent implements OnInit {

  @ViewChild('m') more!: ElementRef

  @Input() isActive: boolean = false
  @Input() scene!: Scene

  @Output() itemClickedEvent = new EventEmitter<ListItemComponent>()
  @Output() deleteClickedEvent = new EventEmitter<ListItemComponent>()
  @Output() duplicateClickedEvent = new EventEmitter<ListItemComponent>()

  isCtxShowing: boolean = false

  constructor() { } 
  ngOnInit(): void { }
  

  onClickOutsideOf(target: HTMLElement){
    const isMoreClicked = isElementOrChildClicked(this.more.nativeElement, target)

    if(!isMoreClicked){ this.isCtxShowing = false}
  }

  onDeleteClicked(): void{
    this.deleteClickedEvent.emit(this)
  }

  onDuplicateClicked(): void{
    this.duplicateClickedEvent.emit(this)
    this.isCtxShowing = false
  }
}
