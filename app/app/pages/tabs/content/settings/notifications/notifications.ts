import {Component, forwardRef, NgZone} from '@angular/core';
import {ViewController, Platform, NavController, NavParams, MenuController, Storage, SqlStorage} from 'ionic-angular';
import {AndroidAttribute} from './../../../../../directives/global.helpers';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {DBProvider} from './../../../../../providers/db'


@Component({
  templateUrl: './build/pages/tabs/content/settings/notifications/notifications.html',
  directives: [forwardRef(() => AndroidAttribute)],
  pipes: [TranslatePipe],
  providers: [DBProvider]
})
export class NotificationsPage {
  user: any = {};
  constructor(private platform: Platform
    , private menu: MenuController
    , private nav: NavController
    , private _ngZone: NgZone
    , private db: DBProvider ) {

      if(platform.is('ios')){
        this.db.getValue('user').then((user) => {
            this.user = JSON.parse(user.toString());
        });
      }else{
        let storage = new Storage(SqlStorage);
        storage.get('user').then((user) => {
            this.user = JSON.parse(user);
        })
      }
  }
}
