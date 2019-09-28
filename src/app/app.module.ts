import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FeedItemsComponent } from './components/feed-items/feed-items.component';
import { FeedItemComponent } from './components/feed-item/feed-item.component';
import { StatisticComponent } from './components/statistic/statistic.component';
import { FormsModule } from '@angular/forms';

// import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
// To import Charts
// import { AmexioChartsModule } from 'amexio-ng-extensions';
import { AmexioLayoutModule } from 'amexio-ng-extensions';
// import { AmexioWidgetModule } from 'amexio-ng-extensions';
import { AmexioChartD3Module } from 'amexio-chart-d3';
import { TitlehashPipe } from './pipes/titlehash.pipe';
import { NotReadedPipe } from './pipes/not-readed.pipe';

// const appRoutes: Routes = [
//   { path: 'feed/:slug', component: FeedItemsComponent },
//   { path: 'feed/:slug/:itemSlug', component: FeedItemComponent,  outlet: "itemInfo" }
// ];

@NgModule({
  declarations: [
    AppComponent,
    FeedItemsComponent,
    FeedItemComponent,
    StatisticComponent,
    TitlehashPipe,
    NotReadedPipe 
  ],
  imports: [
    AppRoutingModule,
    // MatGridListModule,
    MatInputModule,
    MatListModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatCheckboxModule,
    // AmexioChartsModule,
    AmexioLayoutModule,
    // AmexioWidgetModule,
    AmexioChartD3Module,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    // RouterModule.forRoot(appRoutes)
    FormsModule
  ],
  providers: [TitlehashPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
