import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../Shared/shared.module';
import { YourShowsComponent } from './home/your-shows/your-shows.component';
import { ShowPreviewComponent } from './home/show-preview/show-preview.component';
import { CreateComponent } from './create/create.component';
import { ScenePositionComponent } from './create/scene-position/scene-position.component';
import { PlayComponent } from './play/play.component';
import { PlaygroundComponent } from './playground/playground.component';
import { CreatorSceneListComponent } from './create/creator-scene-list/creator-scene-list.component';
import { ListItemComponent } from './create/creator-scene-list/list-item/list-item.component';
import { SceneOptionsComponent } from './create/scene-options/scene-options.component';



@NgModule({
  declarations: [
    HomeComponent,
    YourShowsComponent,
    ShowPreviewComponent,
    CreateComponent,
    ScenePositionComponent,
    PlayComponent,
    PlaygroundComponent,
    CreatorSceneListComponent,
    ListItemComponent,
    SceneOptionsComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    HomeComponent,
    CreateComponent,
  ]
})
export class ViewsModule { }
