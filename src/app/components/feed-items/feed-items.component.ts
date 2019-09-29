import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FeedEntry }              from 'src/app/model/feed-entry';
import { TitlehashPipe }          from '../../pipes/titlehash.pipe';
import { FeedService }            from '../../services/feed.service';

@Component({
  selector:    'app-feed-items',
  templateUrl: './feed-items.component.html',
  styleUrls:   ['./feed-items.component.less'],
  providers:   [TitlehashPipe]
})
export class FeedItemsComponent implements OnInit {
  items:     any;
  titlehash: string;
  feedSlug:  string;

  constructor(
    private _feedService :  FeedService,
    private _activateRoute: ActivatedRoute,
    private _router:        Router,
    private _titlehash:     TitlehashPipe) {
      this.feedSlug =  this._activateRoute.snapshot.params['slug'];
    }

  ngOnInit() {
    this.titlehash = localStorage.getItem('itemSlug');

    this._feedService.getFeedBySlug(this.feedSlug).subscribe(feed => {
      const url = feed && feed.url || null;

      if(url) {
        this._feedService.getFeedItemsByUrl(url).subscribe(feedData=> {
          if(feedData && feedData.feed) {
            const feed = feedData.feed;
            let activeFeed: FeedEntry;

            activeFeed = feed.channel.find(f => f.titlehash == this.titlehash);
            if(activeFeed) {
              activeFeed.readed = true;
            }
          }
        });
      }
    });

    this._activateRoute.params.subscribe(routeParams => {
      const feed: any = history.state.data;

      this.feedSlug = routeParams['slug'];

      if(feed && feed.url) {
        this._feedService.getFeedItemsByUrl(feed.url);
      }
    });
  }

  onRowClick(item: any) {
    this.titlehash = this._titlehash.transform(item.title);

    localStorage.setItem('itemSlug', this.titlehash);
    item.readed = true;

    this._router.navigate([{
      outlets: {
        items: ['feeds', this.feedSlug],
        itemInfo: ['feed', this.titlehash ],
        itemStatistic: ['feed', this.titlehash] 
      }}], { state: { data: item }});
  }
}
