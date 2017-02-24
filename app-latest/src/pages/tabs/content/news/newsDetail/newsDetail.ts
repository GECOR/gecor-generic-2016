import {Component} from '@angular/core';
import {Platform, NavController, NavParams} from 'ionic-angular';
import {DBProvider} from './../../../../../providers/db';
import {useSQLiteOniOS} from './../../../../../app/appConfig';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'news-detail-page',
  templateUrl: 'newsDetail.html',
  providers: [DBProvider]
})
export class NewsDetailPage {
  notice: any;
  user: any = {};
  //storage: any;
  
  constructor(private nav: NavController
  , private params: NavParams
  , private platform: Platform
  , private db: DBProvider
  , public storage: Storage) {
    this.notice = params.data;
    
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
}
