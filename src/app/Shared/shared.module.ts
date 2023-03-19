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
import { ClickedoutsideofDirective } from '../Directives/clickoutsideof.directive';
import { NotificationsComponent } from './notifications/notifications.component';
import { ConfirmPopupComponent } from './confirm-popup/confirm-popup.component';
import { IconsModule } from '../icons.module';
import { SelectallOnclickDirective } from '../Directives/selectall-onclick.directive';
import { ModalComponent } from './modal/modal.component';
import { ConnectionStatusComponent } from './connection-status/connection-status.component';
import { ShowImporterComponent } from './show-importer/show-importer.component';

@NgModule({
  declarations: [
    ShowsListComponent,
    ShowCardComponent,
    NavbarComponent,
    SceneListComponent,
    DropdownComponent,
    SortingSelectorComponent,
    ClickedoutsideofDirective,
    NotificationsComponent,
    ConfirmPopupComponent,
    SelectallOnclickDirective,
    ModalComponent,
    ConnectionStatusComponent,
    ShowImporterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    IconsModule
  ],
  exports:[
    IconsModule,
    CommonModule,
    ShowsListComponent,
    NavbarComponent,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SceneListComponent,
    DropdownComponent,
    SortingSelectorComponent,
    ClickedoutsideofDirective,
    NotificationsComponent,
    ConfirmPopupComponent,
    SelectallOnclickDirective,
    ModalComponent,
    ConnectionStatusComponent,
    ShowImporterComponent,
  ]
})
export class SharedModule { }
