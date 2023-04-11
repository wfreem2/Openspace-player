import { Component, OnInit } from '@angular/core';
import { first, map } from 'rxjs';
import { Show } from 'src/app/Models/Show';
import { ShowPreviewService } from 'src/app/Views/home/show-preview.service';
import { ShowService } from 'src/app/Services/show.service';

@Component({
  selector: 'your-shows',
  templateUrl: './your-shows.component.html',
  styleUrls: ['./your-shows.component.scss']
})
export class YourShowsComponent implements OnInit {

  selectedShow?: Show
  shows!: Show[]
  query: string = ''
  showImporter: boolean = false
  showDeleteConfirm: boolean = false

  
  readonly allShows: ShowPipe = {
    name: 'all',
    transform: s => s
  }

  readonly favoriteShows: ShowPipe = {
    name: 'favorites',
    transform: s => s
  }

  readonly recentShows: ShowPipe = {
    name: 'favorites',
    transform: s => s.sort((a, b) => {

      if(a.dateCreated > b.dateCreated){
        return -1
      }

      if(a.dateCreated < b.dateCreated){
        return 1
      }

      return 0
    })
  }
  
  selectedPipe: ShowPipe = this.allShows

  constructor(private showService: ShowService, public showPreviewService: ShowPreviewService) { 
    showService.getAllShows()
    .pipe( 
      map(shows => shows.length ? shows : []),
      first()
    )
    .subscribe(shows => this.shows = shows)


  }

  ngOnInit(): void { }

  deleteShow(): void{
    this.showDeleteConfirm = false
    this.showService.removeShowById(this.selectedShow!.id)
  }
}


export interface ShowPipe{
  name: string,
  transform(show: Show[]): Show[]
}
