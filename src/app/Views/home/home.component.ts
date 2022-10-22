import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { SlideInOut } from 'src/app/Animations/animations';
import { Show } from 'src/app/Interfaces/Show';
import { ShowPreviewService } from 'src/app/Services/show-preview.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [SlideInOut]
})
export class HomeComponent implements OnInit {

  isPreviewing:boolean = false
  show!: Show
  
  constructor(showPreviewService: ShowPreviewService) { 
    showPreviewService
    .currentShow()
    .pipe(
      map(s => {
        if(s){ this.isPreviewing = true }
        else{ this.isPreviewing = false}
        
        return s
      })
      )
    .subscribe(s => this.show = s)
  }
  
  ngOnInit(): void { }



}
