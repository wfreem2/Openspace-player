import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowsListComponent } from './shows-list/shows-list.component';
import { ShowCardComponent } from './show-card/show-card.component';



@NgModule({
  declarations: [
    ShowsListComponent,
    ShowCardComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    CommonModule,
    ShowsListComponent
  ]
})
export class SharedModule { }
