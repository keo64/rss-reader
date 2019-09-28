import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
// import { BehaviorSubject } from "rxjs/Rx";
// import {Subject} from "rxjs/Subject";
import { map } from 'rxjs/operators';
import * as xml2js from 'xml2js';
import { LocalFeed, Feed, FeedInfo } from '../model/feed';
import { environment } from '../../environments/environment';
import { FeedEntry } from '../model/feed-entry';
import { TitlehashPipe } from '../pipes/titlehash.pipe';


@Injectable({
  providedIn: 'root'
})
export class FeedService {
  feedListPath = environment.feedListPath;
  localFeeds: Observable<LocalFeed[]>;
  feedItems: Observable<Feed>;
  localFeedObserv: BehaviorSubject<LocalFeed> = new BehaviorSubject(new LocalFeed());
  feedItemObserv: BehaviorSubject<FeedEntry> = new BehaviorSubject(new FeedEntry());

  constructor(
    private _http: HttpClient,
    private _titlehash: TitlehashPipe) { }

  initLocalFeeds(): Observable<LocalFeed[]> {      
      this.localFeeds = this._http.get(this.feedListPath).pipe(map(data=>{
          let feeds = data["feeds"];
          let dataFeeds = feeds.map(function(feed:any) {
            return feed;
          });
          let localFeeds = JSON.parse(localStorage.getItem('localFeeds'));

          if(localFeeds) {
            for (let index = localFeeds.length - 1; index == 0; index--) {
              const localFeed = localFeeds[index];
              dataFeeds.unshift(localFeed);
            }
          }

          return dataFeeds;
      }));

      return this.localFeeds;
  }

  getLocalFeeds(): Observable<LocalFeed[]> {
    return this.localFeeds;
  }

  getFeedBySlug(slug):Observable<LocalFeed> {
    this.getLocalFeeds().subscribe(
      data => {
        this.localFeedObserv.next(data.find(f => f.slug == slug));
      });

    return this.localFeedObserv;
  }

  getFeedItems(): Observable<Feed> {
    return this.feedItems;
  }

  getFeedItemsByUrl(url: string): Observable<Feed> {
    const _that = this;

    this.feedItems = this._http.get('https://cors-anywhere.herokuapp.com/' + url, {responseType: 'text'})
      .pipe(map(this.parseFeedItem.bind(this)));

    return this.feedItems;
  }

  getFeedByTitleHash(titlehash):Observable<FeedEntry> {
    const items = this.getFeedItems();
    if(items) {
      items.subscribe(
        data => {
          this.feedItemObserv.next(data.feed.channel.find(f => f.titlehash == titlehash));
        });
    } else {
      setTimeout(this.getFeedByTitleHash.bind(this, titlehash), 500);
    }

    return this.feedItemObserv;
  }

  private parseFeedItem(response: any): Feed {
    const
      _that = this,
      parser = new xml2js.Parser({
        explicitArray : false,
        mergeAttrs    : true
    });

    let feed: Feed = new Feed();

    parser.parseString(response, function(err: any, result: any) {
      if (err) {
        console.warn(err);
      }

      let
        resultFeed:any = result.rss || result.feed,
        resultFeedChannelItems:any = (resultFeed.channel && resultFeed.channel.item) || resultFeed.entry,
        authorList:any = [];

      if(resultFeed.author) {
        authorList.push(resultFeed.author.name);
      }

      for (let index = 0; index < resultFeedChannelItems.length; index++) {
        const item = resultFeedChannelItems[index];

        item.titlehash = _that._titlehash.transform(item.title);
        item.content = (item.content && item.content._) ||
          item.fulltext ||
          item['content:encoded'] ||
          item.description;
        if(item.author && !authorList.includes(item.author.name)) {
          authorList.push(item.author.name);
        }
      }

      feed.feed = resultFeed;
      feed.feed.authors = authorList;
      feed.feed.channel = resultFeedChannelItems;

      // feed = result;
    });


    return feed;
  }
}
