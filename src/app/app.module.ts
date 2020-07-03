import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { ICPComponent } from './components/icp/icp.component';

@NgModule({
  declarations: [
    AppComponent,
    TimelineComponent,
    ICPComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
