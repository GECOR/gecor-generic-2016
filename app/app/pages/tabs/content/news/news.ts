import {Page, NavController, Storage, SqlStorage} from 'ionic-angular';
import {forwardRef} from '@angular/core';
import {AndroidAttribute} from './../../../../directives/global.helpers';
import {NewsDetailPage} from './newsDetail/newsDetail';
import {ConferenceData} from './../../../../providers/conference-data';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

@Page({
  templateUrl: 'build/pages/tabs/content/news/news.html',
  directives: [forwardRef(() => AndroidAttribute)],
   pipes: [TranslatePipe]
})
export class NewsPage {
  news: any[];
  storage: any;
  user: any = {};
  
  constructor(private nav: NavController, private confData: ConferenceData) {
    //this.news = confData.data.notices;
    confData.getNews().then(news =>{
      this.news = news;
      console.log(this.news);
    });
    
    this.storage = new Storage(SqlStorage); 
    this.storage.get('user').then((user) => {
        this.user = JSON.parse(user);
    });

  }

  openNoticeDetail(notice){
    this.nav.push(NewsDetailPage, notice);
  }
}
