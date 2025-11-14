import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { AdminModule } from './admin/admin.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { TuiRootModule } from '@taiga-ui/core';
import { HttpClientModule } from '@angular/common/http';
import {  ReactiveFormsModule } from '@angular/forms';
import { MainPageComponent } from './main-page/main-page.component';
import { TuiInputModule, TuiInputPasswordModule } from '@taiga-ui/kit';

@NgModule({
  declarations: [AppComponent, MainPageComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    AdminModule,
    BrowserAnimationsModule,
    RouterModule,
    TuiRootModule,
    HttpClientModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiInputPasswordModule,

  ],
  bootstrap: [AppComponent],
})
export class AppModule {}