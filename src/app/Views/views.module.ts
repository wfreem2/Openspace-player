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
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TabsComponent } from './create/tabs/tabs.component';
import { TabComponent } from './create/tabs/tab/tab.component';
import { SearchScenesPipe } from './create/search-scenes.pipe';
import { SearchShowsPipe } from './home/your-shows/search-shows.pipe';
import { CreatorHeaderComponent } from './create/creator-header/creator-header.component';
import { CreatorMenuComponent } from './create/creator-menu/creator-menu.component';
import { CreatorMenuItemComponent } from './create/creator-menu-item/creator-menu-item.component';



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
    SceneOptionsComponent,
    TabsComponent,
    TabComponent,
    SearchScenesPipe,
    SearchShowsPipe,
    CreatorHeaderComponent,
    CreatorMenuComponent,
    CreatorMenuItemComponent,
  ],
  imports: [
    SharedModule,
    DragDropModule
  ],
  exports: [
    HomeComponent,
    CreateComponent,
  ]
})
export class ViewsModule { }
