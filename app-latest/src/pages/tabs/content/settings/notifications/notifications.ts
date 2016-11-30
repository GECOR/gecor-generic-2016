import {Component, forwardRef, NgZone} from '@angular/core';
import {ViewController, Platform, NavController, NavParams, MenuController} from 'ionic-angular';
import {AndroidAttribute} from './../../../../../directives/global.helpers';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {DBProvider} from './../../../../../providers/db'
import {defaultLanguage, folderLanguage, sourceLanguage, compareLanguage, useSQLiteOniOS} from './../../../../../app/appConfig';
import {Storage} from '@ionic/storage';


@Component({
  selector: 'notifications-page',
  templateUrl: 'notifications.html',
  //directives: [forwardRef(() => AndroidAttribute)],
  //pipes: [TranslatePipe],
  providers: [DBProvider]
})
export class NotificationsPage {
  user: any = {};
  constructor(private platform: Platform
    , private menu: MenuController
    , private nav: NavController
    , private _ngZone: NgZone
    , private db: DBProvider
    , public storage: Storage ) {

      if(platform.is('ios') && useSQLiteOniOS){
        this.db.getValue('user').then((user) => {
            this.user = JSON.parse(user.toString());
        });
      }else{
        //let storage = new Storage(SqlStorage);
        this.storage.get('user').then((user) => {
            this.user = JSON.parse(user);
        })
      }
  }
}
