import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { FeedItemsComponent } from './components/feed-items/feed-items.component';
import { FeedItemComponent } from './components/feed-item/feed-item.component';
import { StatisticComponent } from './components/statistic/statistic.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent },
  {
    path:      'feeds/:slug',
    component: FeedItemsComponent,
    outlet:    "items"},
  {
    path:      'feed/:feedSlug',
    component: FeedItemComponent,
    outlet:    "itemInfo"
  },
  {
    path:      'feed/:feedSlug',
    component: StatisticComponent,
    outlet:    "itemStatistic"
  },
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule {}
