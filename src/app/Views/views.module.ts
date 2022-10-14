import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../Shared/shared.module';



@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    SharedModule
  ]
})
export class ViewsModule { }
