import {Page, NavController} from 'ionic-angular';
import {forwardRef} from '@angular/core';
import {AndroidAttribute} from './../../../../directives/global.helpers';
import {ConferenceData} from './../../../../providers/conference-data';

@Page({
  templateUrl: 'build/pages/tabs/content/home/home.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class HomePage {
  news: any[];
  constructor(private nav: NavController, private confData: ConferenceData) {

  }

  openNoticeDetail(notice){
    //this.nav.push(NewsDetailPage, notice);
  }
}
