import { Component, OnDestroy, OnInit } from '@angular/core';
import { first, map, takeUntil } from 'rxjs';
import { Show } from 'src/app/Models/Show';
import { ShowService } from 'src/app/Services/show.service';
import { BaseComponent } from 'src/app/Shared/base/base.component';

@Component({
  selector: 'your-shows',
  templateUrl: './your-shows.component.html',
  styleUrls: ['./your-shows.component.scss']
})
export class YourShowsComponent extends BaseComponent implements OnInit, OnDestroy {

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
    name: 'recent',
    transform: s => s.sort((a, b) => {

      const aDate = new Date(a.dateCreated)
      const bDate = new Date(b.dateCreated)

      if(aDate > bDate){
        return -1
      }

      if(aDate < bDate){
        return 1
      }

      return 0
    })
  }
  
  selectedPipe: ShowPipe = this.allShows

  constructor(private showService: ShowService) { 
    super()

    showService.getAllShows()
    .pipe( 
      map(shows => shows.length ? shows : []),
      takeUntil(this.$unsub)
    )
    .subscribe(shows => this.shows = shows)
  }

  ngOnInit(): void { }

  deleteShow(): void{
    this.showDeleteConfirm = false
    console.log(this.selectedShow);
    
    this.showService.removeShowById(this.selectedShow!.id)
  }

  applyFilter(pipe: ShowPipe){
    this.selectedPipe = pipe
  }
}


export interface ShowPipe{
  name: string,
  transform(shows: Show[]): Show[]
}
