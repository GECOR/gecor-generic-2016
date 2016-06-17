import {Component, forwardRef} from '@angular/core';
import {Platform, NavController, Storage, SqlStorage} from 'ionic-angular';
import {AndroidAttribute} from './../../../../directives/global.helpers';
import {ConferenceData} from './../../../../providers/conference-data';
import {DBProvider} from './../../../../providers/db';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {defaultLanguage, folderLanguage, sourceLanguage, compareLanguage, useSQLiteOniOS} from './../../../../appConfig';

@Component({
  templateUrl: 'build/pages/tabs/content/home/home.html',
  directives: [forwardRef(() => AndroidAttribute)],
  providers: [DBProvider],
  pipes: [TranslatePipe] 
})
export class HomePage {
  news: any[];
  storage: any;
  user: any = {};
  
  constructor(private nav: NavController
  , private platform: Platform
  , private confData: ConferenceData
  , private db: DBProvider) {
    
    if(platform.is('ios') && useSQLiteOniOS){
      db.getValue('user').then((user) => {
          this.user = JSON.parse(user.toString());
      });      
    }else{
      this.storage = new Storage(SqlStorage);
      this.storage.get('user').then((user) => {
          this.user = JSON.parse(user);
      });
    }
  }

  openNoticeDetail(notice){
    //this.nav.push(NewsDetailPage, notice);
  }
}
