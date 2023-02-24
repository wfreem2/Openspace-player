import { Component, Input, OnInit } from '@angular/core';
import { CreatorMenuItem } from 'src/app/Models/CreatorMenuItem';

@Component({
  selector: 'creator-menu',
  templateUrl: './creator-menu.component.html',
  styleUrls: ['./creator-menu.component.scss']
})
export class CreatorMenuComponent implements OnInit {

  @Input() menuItems: CreatorMenuItem[] = []
  

  items!:{ menuItem: CreatorMenuItem, isShowing: boolean }[]

  constructor() { }

  ngOnInit(): void {
    this.items = this.menuItems.map(item => {
      return { isShowing: false, menuItem: item }
    })
  }

}
