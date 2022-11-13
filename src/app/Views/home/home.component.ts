import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { SlideInOut } from 'src/app/Animations/animations';
import { Show } from 'src/app/Interfaces/Show';
import { ShowPreviewService } from 'src/app/Views/home/show-preview.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [SlideInOut]
})
export class HomeComponent implements OnInit, OnDestroy {

  show!: Show
  isPreviewing:boolean = false
  
  private readonly $destroy = new Subject<void>()

  constructor(showPreviewService: ShowPreviewService) { 
    showPreviewService
    .currentShow()
    .pipe(
      takeUntil(this.$destroy),
      tap( s => {
        if(s){ this.isPreviewing = true }
        else{ this.isPreviewing = false}
      })
    )
    .subscribe(s => this.show = s)
  }
  
  ngOnInit(): void { }

  ngOnDestroy(): void { this.$destroy.next() }
}
