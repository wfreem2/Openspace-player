import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditShowGuard } from './Services/edit-show.guard';
import { CreateComponent } from './Views/create/create.component';
import { HomeComponent } from './Views/home/home.component';
import { YourShowsComponent } from './Views/home/your-shows/your-shows.component';

const routes: Routes = [
  { path: '', redirectTo: 'shows', pathMatch: 'full' },
  // { path: 'editor', redirectTo: 'editor/new', pathMatch: 'full' },
  { path: 'creator/:id', component: CreateComponent, canActivate: [EditShowGuard] },
  // { path: 'creator/new', component: CreateComponent },
  { path: 'shows', component: HomeComponent, children: [
    { path: '', component: YourShowsComponent }
  ]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
