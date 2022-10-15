import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './Views/create/create.component';
import { HomeComponent } from './Views/home/home.component';
import { YourShowsComponent } from './Views/home/your-shows/your-shows.component';

const routes: Routes = [
  { path: '', redirectTo: 'shows', pathMatch: 'full' },
  { path: 'create', component: CreateComponent },
  { path: 'shows', component: HomeComponent, children: [
    { path: '', component: YourShowsComponent }
  ]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
