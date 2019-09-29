import { FeedEntry } from './feed-entry';

export class LocalFeed {
  slug:  string;
  title: string;
  url:   string;
  feed: string;

  constructor(feed:any) {
    this.slug  = feed.slug;
    this.title = feed.title;
    this.url   = feed.url;
    this.feed  = feed.feed;
  }
}

export class Feed {
  feed: Rss;
}

export interface Rss {
  authors: any;
  version: string;
  channel: FeedInfo;
}

export interface FeedInfo {
  length: any;
  find(arg0: (f: any) => void): FeedEntry;
  title: string;
  link: string;
  description: string;
  pubDate: Date;
  item: FeedEntry[];
}