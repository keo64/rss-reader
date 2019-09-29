import { Component, OnInit } from '@angular/core';
import { ActivatedRoute }    from '@angular/router';
import { FeedEntry }         from '../../model/feed-entry';
import { FeedService }       from '../../services/feed.service';

@Component({
  selector:    'app-feed-item',
  templateUrl: './feed-item.component.html',
  styleUrls:   ['./feed-item.component.less']
})
export class FeedItemComponent implements OnInit {
  item:    FeedEntry;
  image:   string;
  content: string;
  title:   string;

  constructor(
    private _activateRoute: ActivatedRoute,
    private _feedService : FeedService) {}

  ngOnInit() {
    this._activateRoute.params.subscribe(routeParams => {
      const item: any = history.state.data;

      if(item) {
        this.setfeedItemContent(item);
      } else {
        const titlehash: string = routeParams.feedSlug;

        this._feedService.getFeedByTitleHash(titlehash).subscribe(data=> {
          this.setfeedItemContent(data);
        });
      }
    });
  }

  setfeedItemContent(item: any) {
    if(item && item.content) {
      this.item = item;
      this.title = item.title;
      this.image = item.enclosure && item.enclosure.url;
      this.content = item.content;
    }
  }
}
