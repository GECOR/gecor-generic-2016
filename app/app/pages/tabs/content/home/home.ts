import {Component, forwardRef} from '@angular/core';
import {NavController, Storage, SqlStorage} from 'ionic-angular';
import {AndroidAttribute} from './../../../../directives/global.helpers';
import {ConferenceData} from './../../../../providers/conference-data';
import {DBProvider} from './../../../../providers/db';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

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
  , private confData: ConferenceData
  , private db: DBProvider) {
    
    this.storage = new Storage(SqlStorage);
    /*this.storage.get('user').then((user) => {
        this.user = JSON.parse(user);
    })*/

    db.getValue('user').then((user) => {
        this.user = JSON.parse(user.toString());
    });
  }

  openNoticeDetail(notice){
    //this.nav.push(NewsDetailPage, notice);
  }
}
