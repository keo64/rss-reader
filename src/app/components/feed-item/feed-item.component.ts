import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FeedEntry } from '../../model/feed-entry';
import { FeedService } from '../../services/feed.service';

@Component({
  selector: 'app-feed-item',
  templateUrl: './feed-item.component.html',
  styleUrls: ['./feed-item.component.less']
})
export class FeedItemComponent implements OnInit {
  item: FeedEntry;
  image: string;
  content: string;
  title: string;

  constructor(
    private _activateRoute: ActivatedRoute,
    private _feedService : FeedService) {}

  ngOnInit() {
    this._activateRoute.params.subscribe(routeParams => {
      const item: any = history.state.data;

      if(item) {
        this.item = item;
        this.title = item.title;
        this.image = item.enclosure && item.enclosure.url;
        this.content = item.content;
      } else {
        const _that = this;

        const titlehash: string = routeParams.feedSlug;
        _that._feedService.getFeedByTitleHash(titlehash).subscribe(data=> {
          if(data) {
            _that.item = data;
            _that.title = data.title;
            _that.image = data.enclosure && data.enclosure.url;
            _that.content = data.content;
          }
        });
      }
    });
  }
}
