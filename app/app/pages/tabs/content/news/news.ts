import {Page, NavController} from 'ionic-angular';
import {forwardRef} from '@angular/core';
import {AndroidAttribute} from './../../../../directives/global.helpers';
import {NewsDetailPage} from './newsDetail/newsDetail';
import {ConferenceData} from './../../../../providers/conference-data';

@Page({
  templateUrl: 'build/pages/tabs/content/news/news.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class NewsPage {
  news: any[];
  constructor(private nav: NavController, private confData: ConferenceData) {
    //this.news = confData.data.notices;
    confData.getNews().then(news =>{
      this.news = news;
      console.log(this.news);
    });

  }

  openNoticeDetail(notice){
    this.nav.push(NewsDetailPage, notice);
  }
}
