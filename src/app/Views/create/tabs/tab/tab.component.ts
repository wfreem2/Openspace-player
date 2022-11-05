import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tab',
  template: `<div><ng-content *ngIf="isActive"></ng-content></div>`
})

export class TabComponent implements OnInit {

  @Input() name!: string
  @Input() isActive: boolean = false
  
  constructor() { }

  ngOnInit(): void { }

}
