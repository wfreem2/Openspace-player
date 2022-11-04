import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowsListComponent } from './shows-list/shows-list.component';
import { ShowCardComponent } from './show-card/show-card.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SceneListComponent } from './scene-list/scene-list.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { SortingSelectorComponent } from './sorting-selector/sorting-selector.component';



@NgModule({
  declarations: [
    ShowsListComponent,
    ShowCardComponent,
    NavbarComponent,
    SceneListComponent,
    DropdownComponent,
    SortingSelectorComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],
  exports:[
    CommonModule,
    ShowsListComponent,
    NavbarComponent,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SceneListComponent,
    DropdownComponent,
    SortingSelectorComponent
  ]
})
export class SharedModule { }
