import { NgModule } from '@angular/core'
import { SharedModule } from '../Shared/shared.module'
import { CreateComponent } from './create/create.component'
import { PlayComponent } from './play/play.component'
import { PlaygroundComponent } from './playground/playground.component'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { SearchScenesPipe } from './create/pipes/search-scenes.pipe'
import { CreatorMenuItemComponent } from './create/components/creator-menu-item/creator-menu-item.component'
import { CreatorMenuComponent } from './create/components/creator-menu/creator-menu.component'
import { CreatorSceneListComponent } from './create/components/creator-scene-list/creator-scene-list.component'
import { ListItemComponent } from './create/components/creator-scene-list/list-item/list-item.component'
import { SceneOptionsComponent } from './create/components/scene-options/scene-options.component'
import { ScenePositionComponent } from './create/components/scene-position/scene-position.component'
import { TabComponent } from './create/components/tabs/tab/tab.component'
import { TabsComponent } from './create/components/tabs/tabs.component'
import { ShowIssuesComponent } from './create/components/show-issues/show-issues.component'
import { ShowCardComponent } from './home/show-card/show-card.component'
import { FilterSortShowPipe } from './home/filter-sort-show.pipe'
import { SearchShowsPipe } from './home/search-shows.pipe'
import { YourShowsComponent } from './home/your-shows.component'

@NgModule({
	declarations: [
		YourShowsComponent,
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
		CreatorMenuComponent,
		CreatorMenuItemComponent,
		ShowIssuesComponent,
		ShowCardComponent,
		FilterSortShowPipe
	],
	imports: [SharedModule, DragDropModule],
	exports: [CreateComponent]
})
export class ViewsModule {}
