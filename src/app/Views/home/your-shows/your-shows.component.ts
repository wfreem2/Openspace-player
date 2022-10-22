import { Component, OnInit } from '@angular/core';
import { Show } from 'src/app/Interfaces/Show';

@Component({
  selector: 'app-your-shows',
  templateUrl: './your-shows.component.html',
  styleUrls: ['./your-shows.component.scss']
})
export class YourShowsComponent implements OnInit {

  shows: Show[] = []

  constructor() { }

  ngOnInit(): void {
  }

}
