import {Component, forwardRef} from '@angular/core';
import {Platform, NavController} from 'ionic-angular';
import {AndroidAttribute} from './../../../../directives/global.helpers';
import {NewsDetailPage} from './newsDetail/newsDetail';
import {ConferenceData} from './../../../../providers/conference-data';
import {DBProvider} from './../../../../providers/db';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {defaultLanguage, folderLanguage, sourceLanguage, compareLanguage, useSQLiteOniOS} from './../../../../app/appConfig';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'news-page',
  templateUrl: 'news.html',
  //directives: [forwardRef(() => AndroidAttribute)],
  providers: [DBProvider],
  //pipes: [TranslatePipe]
})
export class NewsPage {
  news: any[];
  //storage: any;
  user: any = {};
  
  constructor(private nav: NavController
  , private confData: ConferenceData
  , private platform: Platform
  , private db: DBProvider
  , public storage: Storage) {
    if(platform.is('ios') && useSQLiteOniOS){
      this.db.getValue('user').then((user) => {
          this.user = JSON.parse(user.toString());
      });
    }else{
      //this.storage = new Storage(SqlStorage); 
      this.storage.get('user').then((user) => {
          this.user = JSON.parse(user);
      });
    }
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
