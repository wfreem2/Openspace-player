import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { ShowPreviewService } from 'src/app/Services/show-preview.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isPreviewing:boolean = false
  
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
    .subscribe(s => {
      console.log(s)
    })
  }
  
  ngOnInit(): void { }



}
