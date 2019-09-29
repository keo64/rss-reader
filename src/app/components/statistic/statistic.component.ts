import { Component, OnInit } from '@angular/core';
import { ActivatedRoute }    from '@angular/router';
import { FrequencyService }  from '../../services/frequency.service';
import { FeedEntry }         from '../../model/feed-entry';
import { FeedService }       from '../../services/feed.service';


@Component({
  selector:    'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls:   ['./statistic.component.less']
})
export class StatisticComponent implements OnInit {
  content:       string;
  item:          FeedEntry;
  chartData:     any;
  feedsNumber:   number;
  itemsNumber:   number;
  authorsNumber: number;

  constructor(
    private _feedService :     FeedService,
    private _activateRoute:    ActivatedRoute,
    private _frequencyService: FrequencyService) { }

  ngOnInit() {
    this._activateRoute.params.subscribe(routeParams => {
      const item: any = history.state.data;

      if(item) {
        this.setfeedItemStatistic(item);
      } else {
        const titlehash: string = routeParams.feedSlug;
        this._feedService.getFeedByTitleHash(titlehash).subscribe(data=> {
          this.setfeedItemStatistic(data);
        });
      }
    });

    this._feedService.localFeeds.subscribe(data=> {
      this.feedsNumber = data.size;
    });
    this._feedService.feedItems.subscribe(data=> {
        if(data && data.feed) {
          this.itemsNumber   = data.feed.channel.length;
          this.authorsNumber = data.feed.authors.length;
        }
    });
  }

  setfeedItemStatistic(item: any) {
    const _that = this;

    if(item && item.content) {
      this.content = item.content;

      this.chartData = null;
      setTimeout(function () {
        _that.chartData = _that._frequencyService.getFrequency(_that.content);
      }, 0);
    }
  }

}
