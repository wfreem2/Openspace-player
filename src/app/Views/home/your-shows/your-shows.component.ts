import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { Show } from 'src/app/Interfaces/Show';
import { ShowService } from 'src/app/Services/show.service';

@Component({
  selector: 'app-your-shows',
  templateUrl: './your-shows.component.html',
  styleUrls: ['./your-shows.component.scss']
})
export class YourShowsComponent implements OnInit {

  shows!: Show[]

  constructor(showService: ShowService) { 
    showService.getAllShows()
    .pipe(
      map(shows => shows.length ? shows : [])
    )
    .subscribe(shows => this.shows = shows)
  }

  ngOnInit(): void { }

}
