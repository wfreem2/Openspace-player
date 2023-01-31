import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../Shared/shared.module';
import { YourShowsComponent } from './home/your-shows/your-shows.component';
import { ShowPreviewComponent } from './home/show-preview/show-preview.component';
import { CreateComponent } from './create/create.component';
import { PlayComponent } from './play/play.component';
import { PlaygroundComponent } from './playground/playground.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SearchScenesPipe } from './create/pipes/search-scenes.pipe';
import { SearchShowsPipe } from './home/your-shows/search-shows.pipe';
import { CreatorHeaderComponent } from './create/components/creator-header/creator-header.component';
import { CreatorMenuItemComponent } from './create/components/creator-menu-item/creator-menu-item.component';
import { CreatorMenuComponent } from './create/components/creator-menu/creator-menu.component';
import { CreatorSceneListComponent } from './create/components/creator-scene-list/creator-scene-list.component';
import { ListItemComponent } from './create/components/creator-scene-list/list-item/list-item.component';
import { SceneOptionsComponent } from './create/components/scene-options/scene-options.component';
import { ScenePositionComponent } from './create/components/scene-position/scene-position.component';
import { TabComponent } from './create/components/tabs/tab/tab.component';
import { TabsComponent } from './create/components/tabs/tabs.component';



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
