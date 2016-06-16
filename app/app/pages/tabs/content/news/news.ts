import {Component, forwardRef} from '@angular/core';
import {NavController, Storage, SqlStorage} from 'ionic-angular';
import {AndroidAttribute} from './../../../../directives/global.helpers';
import {NewsDetailPage} from './newsDetail/newsDetail';
import {ConferenceData} from './../../../../providers/conference-data';
import {DBProvider} from './../../../../providers/db';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

@Component({
  templateUrl: 'build/pages/tabs/content/news/news.html',
  directives: [forwardRef(() => AndroidAttribute)],
  providers: [DBProvider],
  pipes: [TranslatePipe]
})
export class NewsPage {
  news: any[];
  storage: any;
  user: any = {};
  
  constructor(private nav: NavController
  , private confData: ConferenceData
  , private db: DBProvider) {
    this.storage = new Storage(SqlStorage); 
    /*this.storage.get('user').then((user) => {
        this.user = JSON.parse(user);
    });*/
    this.db.getValue('user').then((user) => {
        this.user = JSON.parse(user.toString());
    });
   }
  
   ionViewWillEnter() {
     this.confData.getNews().then(news =>{
      this.news = news;
      console.log(this.news);
    });    
  }
  
  openNoticeDetail(notice){
    this.nav.push(NewsDetailPage, notice);
  }
}
