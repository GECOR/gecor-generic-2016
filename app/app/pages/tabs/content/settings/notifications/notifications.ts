import {Component, forwardRef, NgZone} from '@angular/core';
import {NavController, NavParams, MenuController, Storage, SqlStorage} from 'ionic-angular';
import {ViewController, Platform} from 'ionic-angular';
import {AndroidAttribute} from './../../../../../directives/global.helpers';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

@Component({
  templateUrl: './build/pages/tabs/content/settings/notifications/notifications.html',
  directives: [forwardRef(() => AndroidAttribute)],
   pipes: [TranslatePipe]
})
export class NotificationsPage {
  user: any = {};
  constructor(private platform: Platform
    , private menu: MenuController
    , private nav: NavController
    , private _ngZone: NgZone ) {
      let storage = new Storage(SqlStorage);
      storage.get('user').then((user) => {
          this.user = JSON.parse(user);
      })
  }



}
