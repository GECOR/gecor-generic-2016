import {Page, NavController, Storage, SqlStorage} from 'ionic-angular';
import {forwardRef} from '@angular/core';
import {AndroidAttribute} from './../../../../directives/global.helpers';
import {ConferenceData} from './../../../../providers/conference-data';

@Page({
  templateUrl: 'build/pages/tabs/content/home/home.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class HomePage {
  news: any[];
  storage: any;
  user: any = {};
  
  constructor(private nav: NavController
  , private confData: ConferenceData) {
    
    this.storage = new Storage(SqlStorage);
    this.storage.get('user').then((user) => {
        this.user = JSON.parse(user);
    })
  }

  openNoticeDetail(notice){
    //this.nav.push(NewsDetailPage, notice);
  }
}
