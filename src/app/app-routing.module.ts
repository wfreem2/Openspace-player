import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowCreatorGuard } from './Services/creator.guard';
import { PlayerGuard } from './Services/player.guard';
import { CreateComponent } from './Views/create/create.component';
import { HomeComponent } from './Views/home/home.component';
import { YourShowsComponent } from './Views/home/your-shows/your-shows.component';
import { PlayComponent } from './Views/play/play.component';
import { PlaygroundComponent } from './Views/playground/playground.component';

const routes: Routes = [
  { path: '', redirectTo: 'shows', pathMatch: 'full' },
  { path: 'creator/:id', component: CreateComponent, canActivate: [ShowCreatorGuard] },
  { path: 'player/:id', component: PlayComponent, canActivate: [PlayerGuard] },
  {path: 'playground', component: PlaygroundComponent },
  { path: 'shows', component: HomeComponent, children: [
    { path: '', component: YourShowsComponent }
  ]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
