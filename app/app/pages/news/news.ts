import {Page, NavController} from 'ionic-framework/ionic';
import {forwardRef} from 'angular2/core';
import {AndroidAttribute} from './../../directives/global.helpers';
import {NewsDetailPage} from './newsDetail/newsDetail';
import {ConferenceData} from './../../providers/conference-data';

@Page({
  templateUrl: 'build/pages/news/news.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class NewsPage {
  news: any[];
  constructor(private nav: NavController, private confData: ConferenceData) {
    this.news = confData.data.notices;
    console.log('News from -> ');
    console.log(this.news);
  }

  openNoticeDetail(){
    this.nav.push(NewsDetailPage, {});
  }
}
