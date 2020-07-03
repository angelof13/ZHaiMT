import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { ICPComponent } from './components/icp/icp.component';
import { ShadeComponent } from './components/shade/shade.component';

@NgModule({
  declarations: [
    AppComponent,
    TimelineComponent,
    ICPComponent,
    ShadeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
