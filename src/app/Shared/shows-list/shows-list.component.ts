import { Component, Input, OnInit } from '@angular/core';
import { Show } from 'src/app/Interfaces/Show';

@Component({
  selector: 'shows-list',
  templateUrl: './shows-list.component.html',
  styleUrls: ['./shows-list.component.scss']
})
export class ShowsListComponent implements OnInit {


  @Input() showsList?: Show[]

  constructor() { }

  ngOnInit(): void {
    this.showsList = [
      { name: 'Moon & Stars'},
      { name: 'Sun with the Earth'},
      { name: 'M87 Galaxy'},
    ]
  }

}
