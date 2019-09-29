import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FeedItemsComponent } from './components/feed-items/feed-items.component';
import { FeedItemComponent } from './components/feed-item/feed-item.component';
import { StatisticComponent } from './components/statistic/statistic.component';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
// To import Charts
import { AmexioLayoutModule } from 'amexio-ng-extensions';
// import { AmexioWidgetModule } from 'amexio-ng-extensions';
import { AmexioChartD3Module } from 'amexio-chart-d3';

import { TitlehashPipe } from './pipes/titlehash.pipe';
import { NotReadedPipe } from './pipes/not-readed.pipe';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

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
    MatInputModule,
    MatListModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSelectModule,
    AmexioLayoutModule,
    AmexioChartD3Module,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  })
  ],
  providers: [TitlehashPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
