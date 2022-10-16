import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../Shared/shared.module';
import { YourShowsComponent } from './home/your-shows/your-shows.component';
import { ShowPreviewComponent } from './home/show-preview/show-preview.component';
import { CreateComponent } from './create/create.component';
import { SceneComponent } from './create/scene/scene.component';



@NgModule({
  declarations: [
    HomeComponent,
    YourShowsComponent,
    ShowPreviewComponent,
    CreateComponent,
    SceneComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    HomeComponent,
    CreateComponent
  ]
})
export class ViewsModule { }
