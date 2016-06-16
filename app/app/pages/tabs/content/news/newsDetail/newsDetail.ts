import {Component, forwardRef} from '@angular/core';
import {NavController, NavParams, Storage, SqlStorage} from 'ionic-angular';
import {AndroidAttribute} from './../../../../../directives/global.helpers';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {DBProvider} from './../../../../../providers/db';

@Component({
  templateUrl: 'build/pages/tabs/content/news/newsDetail/newsDetail.html',
  directives: [forwardRef(() => AndroidAttribute)],
  pipes: [TranslatePipe],
  providers: [DBProvider]
})
export class NewsDetailPage {
  notice: any;
  user: any = {};
  storage: any;
  
  constructor(private nav: NavController
  , private params: NavParams
  , private db: DBProvider) {
    this.notice = params.data;
    
    this.storage = new Storage(SqlStorage); 
    /*this.storage.get('user').then((user) => {
        this.user = JSON.parse(user);
    });*/
    this.db.getValue('user').then((user) => {
        this.user = JSON.parse(user.toString());
    });
  }
}
