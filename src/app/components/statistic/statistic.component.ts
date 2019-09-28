import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FrequencyService } from '../../services/frequency.service';
import { FeedEntry } from '../../model/feed-entry';
import { FeedService } from '../../services/feed.service';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.less']
})
export class StatisticComponent implements OnInit {
  content: string;
  item: FeedEntry;
  chartData: any;
  feedsNumber: number;
  itemsNumber: number;
  authorsNumber: number;

  constructor(
    private _feedService : FeedService,
    private _activateRoute: ActivatedRoute,
    private _frequencyService: FrequencyService) { }

  ngOnInit() {
    const _this = this;

    this._activateRoute.params.subscribe(routeParams => {
      const item: any = history.state.data;

      if(item) {
        this.content = item.content;
        this._feedService.getLocalFeeds().subscribe(d=> this.feedsNumber = d.length);
        this._feedService.getFeedItems().subscribe(f=> this.itemsNumber = f.feed.channel.length);
        this._feedService.getFeedItems().subscribe(f=> this.authorsNumber = f.feed.authors.length);

        this.chartData = null;
        setTimeout(function () {
          _this.chartData = _this._frequencyService.getFrequency(_this.content);
        }, 0);
      } else {
        const _that = this;

        const titlehash: string = routeParams.feedSlug;
        _that._feedService.getFeedByTitleHash(titlehash).subscribe(data=> {
          if(data && data.content) {
            _that.content = data.content;
            _that._feedService.getLocalFeeds().subscribe(d=> _that.feedsNumber = d.length);
            _that._feedService.getFeedItems().subscribe(f=> _that.itemsNumber = f.feed.channel.length);
            _that._feedService.getFeedItems().subscribe(f=> _that.authorsNumber = f.feed.authors.length);
  
            _that.chartData = null;
            setTimeout(function () {
              _this.chartData = _this._frequencyService.getFrequency(_that.content);
            }, 0);
          }
        });
      }
    });
  }
}
