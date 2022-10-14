import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../Shared/shared.module';
import { YourShowsComponent } from './home/your-shows/your-shows.component';



@NgModule({
  declarations: [
    HomeComponent,
    YourShowsComponent
  ],
  imports: [
    SharedModule
  ]
})
export class ViewsModule { }
