import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShowService } from './Services/show.service';
import { SharedModule } from './Shared/shared.module';
import { ViewsModule } from './Views/views.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    ViewsModule
  ],
  providers: [ShowService],
  bootstrap: [AppComponent]
})
export class AppModule { }
