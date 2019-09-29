import { Component, OnInit }      from '@angular/core';
import { FeedService }            from './services/feed.service';
import { SlugifyPipe }            from './pipes/slugify.pipe';
import { TranslateService }       from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AmexioGridLayoutService, GridConfig, GridConstants} from 'amexio-ng-extensions';
import { LocalFeed } from './model/feed';

@Component({
  selector:    'app-root',
  templateUrl: './app.component.html',
  styleUrls:   ['./app.component.less'],
  providers:   [AmexioGridLayoutService, SlugifyPipe]
})
export class AppComponent implements OnInit {
  slug:            string;
  gridDesktop:     GridConfig;
  gridTablet:      GridConfig;
  gridMobile:      GridConfig;
  feedTitle:       string;
  feedUrl:         string;
  selectedLanguage:any;
  languages: any = [
    { key: 'en', value: 'English' },
    { key: 'ua', value: 'Ukrainian' },
    { key: 'de', value: 'German' },
    { key: 'fr', value: 'French' }
  ];

  constructor(
    private _gridlayoutService: AmexioGridLayoutService,
    private _feedService:       FeedService,
    private _router:            Router,
    private _slugify:           SlugifyPipe,
    private _translate:         TranslateService) {
      // set UI language
      this.initLanguage();

      // Creates All the Layout Configs;     
      this.createLayouts();
    
      // Create the Layouts
      this._gridlayoutService.createLayout(this.gridDesktop);
      this._gridlayoutService.createLayout(this.gridTablet);
      this._gridlayoutService.createLayout(this.gridMobile);
  }

  ngOnInit() {
    this._feedService.initLocalFeeds();
    this.slug = localStorage.getItem('feedSlug');
  }

  selectLanguage() {
    localStorage.setItem('language', this.selectedLanguage);
    this._translate.use(this.selectedLanguage);
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
      const localFeed =
        { "slug": slug, "title": title, "url": url, "feed": "rss" };

      this._feedService.addLocalFeed(localFeed);
      this.feedTitle = '';
      this.feedUrl = '';
    }
  }

  initLanguage() {
    const language = localStorage.getItem('language') || 'en';
    this._translate.setDefaultLang(language);
    this.selectedLanguage = this.languages.find(l => l.key == language).key;
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
