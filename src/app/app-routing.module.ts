import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditShowGuard } from './Services/edit-show.guard';
import { PlayerGuard } from './Services/player.guard';
import { CreateComponent } from './Views/create/create.component';
import { HomeComponent } from './Views/home/home.component';
import { YourShowsComponent } from './Views/home/your-shows/your-shows.component';
import { PlayComponent } from './Views/play/play.component';

const routes: Routes = [
  { path: '', redirectTo: 'shows', pathMatch: 'full' },
  { path: 'creator/:id', component: CreateComponent, canActivate: [EditShowGuard] },
  { path: 'player/:id', component: PlayComponent, canActivate: [PlayerGuard] },
  { path: 'shows', component: HomeComponent, children: [
    { path: '', component: YourShowsComponent }
  ]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
