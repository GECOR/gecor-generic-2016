import {Page, NavController, NavParams, Storage, SqlStorage} from 'ionic-angular';
import {forwardRef} from '@angular/core';
import {AndroidAttribute} from './../../../../../directives/global.helpers';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

@Page({
  templateUrl: 'build/pages/tabs/content/news/newsDetail/newsDetail.html',
  directives: [forwardRef(() => AndroidAttribute)],
   pipes: [TranslatePipe]
})
export class NewsDetailPage {
  notice: any;
  user: any = {};
  storage: any;
  
  constructor(private nav: NavController, private params: NavParams) {
    this.notice = params.data;
    
    this.storage = new Storage(SqlStorage); 
    this.storage.get('user').then((user) => {
        this.user = JSON.parse(user);
    });
  }
}
