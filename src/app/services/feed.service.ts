import * as xml2js         from 'xml2js';
import { List }            from 'immutable';
import { Injectable }      from '@angular/core';
import { LocalFeed, Feed } from '../model/feed';
import { FeedEntry }       from '../model/feed-entry';
import { HttpClient }      from '@angular/common/http';
import { TitlehashPipe }   from '../pipes/titlehash.pipe';
import { environment }     from '../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  feedListPath = environment.feedListPath;
  private _localFeeds: BehaviorSubject<List<LocalFeed>> =
    new BehaviorSubject(List([]));
  private _feedItems: BehaviorSubject<Feed> =
    new BehaviorSubject(new Feed());
  private _localFeed: BehaviorSubject<LocalFeed> =
    new BehaviorSubject(new LocalFeed({}));
  private _feedItem: BehaviorSubject<FeedEntry> =
    new BehaviorSubject(new FeedEntry());

  readonly proxyUrl = 'https://cors-anywhere.herokuapp.com';

  constructor(
    private _http:      HttpClient,
    private _titlehash: TitlehashPipe) {}

  get localFeeds():Observable<List<LocalFeed>> {
    return new Observable(fn => this._localFeeds.subscribe(fn));
  }

  get feedItems():Observable<Feed> {
    return new Observable(fn => this._feedItems.subscribe(fn));
  }

  initLocalFeeds() {
    this._http.get(this.feedListPath)
      .subscribe(
        res => {
          let feeds = res["feeds"];
          let dataFeeds = feeds.map(function(feed:any) {
            return new LocalFeed(feed);
          });
          let localFeeds = JSON.parse(localStorage.getItem('localFeeds'));

          if(localFeeds) {
            for (let index = localFeeds.length - 1; index == 0; index--) {
              const localFeed = localFeeds[index];
              dataFeeds.unshift(new LocalFeed(localFeed));
            }
          }

          this._localFeeds.next(List(dataFeeds));
        },
        err => console.log("Error retrieving local feeds")
    );
  }

  addLocalFeed(localFeed: any) {
    const newLocalFeed = new LocalFeed(localFeed);
    this._localFeeds.next(this._localFeeds.getValue().unshift(newLocalFeed));

    addLocalFeedToStorage(newLocalFeed);

    function addLocalFeedToStorage(localFeed: LocalFeed) {
      let localFeeds = JSON.parse(localStorage.getItem('localFeeds'));
      if(localFeeds) {
        localFeeds.unshift(localFeed);
      } else {
        localFeeds = [localFeed];
      }
      localStorage.setItem('localFeeds',  JSON.stringify(localFeeds));
    }
  }

  getFeedBySlug(slug: string):Observable<LocalFeed> {
    this._localFeeds.subscribe(
      data => {
        this._localFeed.next(data.find(f => f.slug == slug));
      });

    return this._localFeed;
  }

  getFeedItemsByUrl(url: string) {
    this._http.get(this.proxyUrl + '/' + url, { responseType: 'text' })
      .subscribe(
        data => {
          let dataFeed: Feed = this.parseFeedItem(data);
          this._feedItems.next(dataFeed);
        },
        err => console.log("Error retrieving feed items")
    );

    return this._feedItems;
  }

  getFeedByTitleHash(titlehash: string) {
    this._feedItems.subscribe(
      data => {
        if(data && data.feed) {
          this._feedItem
            .next(data.feed.channel.find(f => f.titlehash == titlehash));
        }
      });

    return this._feedItem;
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
        resultFeedChannelItems:any =
          (resultFeed.channel && resultFeed.channel.item) ||
          resultFeed.entry,
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
    });

    return feed;
  }
}
