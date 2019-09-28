import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AmexioGridLayoutService, GridConfig, GridConstants} from 'amexio-ng-extensions';
import { FeedService } from './services/feed.service';
import { SlugifyPipe } from './pipes/slugify.pipe';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  providers: [AmexioGridLayoutService, SlugifyPipe]
})
export class AppComponent implements OnInit {
  title = 'Rss Reader';
  slug: string;
  localFeeds = [];
  gridDesktop: GridConfig;
  gridTablet: GridConfig;
  gridMobile: GridConfig;
  feedTitle: string;
  feedUrl: string;

  constructor(
    private _gridlayoutService : AmexioGridLayoutService,
    private _feedService : FeedService,
    private _activateRoute: ActivatedRoute,
    private _router: Router,
    private _slugify: SlugifyPipe) {

    // Creates All the Layout Configs;     
    this.createLayouts();
    
    // Create the Layouts
    this._gridlayoutService.createLayout(this.gridDesktop);
    this._gridlayoutService.createLayout(this.gridTablet);
    this._gridlayoutService.createLayout(this.gridMobile);
  }

  ngOnInit() {
    this._feedService.initLocalFeeds().subscribe(data => this.localFeeds = data);
    this.slug = localStorage.getItem('feedSlug');
  }

  onRowClick(feed: any) {
    this.slug = feed.slug;
    localStorage.setItem('feedSlug', feed.slug);
    localStorage.setItem('itemSlug', null);
    this._router.navigate([{
      outlets: {
        items: ['feeds', feed.slug],
        itemInfo: null,
        itemStatistic: null 
      }
    }], { state: { data: feed }});
  }

  addFeedUrl(title: string, url:string) {
    if(title.length > 0 && url.length > 0) {
      const slug:string = this._slugify.transform(title);
      const localFeed = { "slug": slug, "title": title, "url": url, "feed": "rss" };

      this.localFeeds.unshift(localFeed);
      this.feedTitle = '';
      this.feedUrl = '';

      let localFeeds = JSON.parse(localStorage.getItem('localFeeds'));
      if(localFeeds) {
        localFeeds.unshift(localFeed);
      } else {
        localFeeds = [localFeed];
      }
      localStorage.setItem('localFeeds',  JSON.stringify(localFeeds));
    }
  }

  // Create Layout Configurations for Desktop / Mobile / Tablets
  createLayouts() {
    this.gridDesktop = new GridConfig('LayoutRssReader', GridConstants.Desktop)
      .addlayout(["gridheader", "gridheader"])
      .addlayout(["gridchannels", "griditems"])
      .addlayout(["griditem", "gridstatistic"]);
    this.gridTablet = new GridConfig('LayoutRssReader', GridConstants.Tablet)
      .addlayout(["gridheader", "gridheader"])
      .addlayout(["gridchannels", "griditems"])
      .addlayout(["griditem", "gridstatistic"]);
    this.gridMobile = new GridConfig('LayoutRssReader', GridConstants.Mobile)
      .addlayout(["gridheader"])
      .addlayout(["gridchannels"])
      .addlayout(["griditems"])
      .addlayout(["griditem"])
      .addlayout(["gridstatistic"]);
    }
}
