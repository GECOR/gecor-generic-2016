import {Component, forwardRef, NgZone} from '@angular/core';
import {ViewController, Platform, NavController, NavParams, MenuController, Storage, SqlStorage} from 'ionic-angular';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {AndroidAttribute} from './../../../../directives/global.helpers';
import {ConferenceData} from './../../../../providers/conference-data';
import {NotificationsPage} from './notifications/notifications';
import {TermsPage} from './terms/terms';
import {UserPage} from './user/user';
import {User} from './../../../login/LoginInterface';
import {EntitiesPage} from './entities/entities';
import {DBProvider} from './../../../../providers/db';

@Component({
  templateUrl: './build/pages/tabs/content/settings/settings.html',
  directives: [forwardRef(() => AndroidAttribute)],
  pipes: [TranslatePipe],
  providers: [DBProvider]
})
export class SettingsPage {
  user: any = {};
  constructor(private platform: Platform
    , private menu: MenuController
    , private confData: ConferenceData
    , private nav: NavController
    , private _ngZone: NgZone
    , private db: DBProvider ) {

  }
  ionViewWillEnter() {
    if(this.platform.is('ios')){
      this.db.getValue('user').then((user) => {
          this.user = JSON.parse(user.toString());
      });
    }else{
      let storage = new Storage(SqlStorage);
      storage.get('user').then((user) => {
          this.user = JSON.parse(user);
      });
    }
  }

  openNotifications() {
    this.nav.push(NotificationsPage, {});
  }

  openTerms() {
    this.nav.push(TermsPage, {});
  }

  openUser() {
    this.nav.push(UserPage, {});
  }

  openEntities() {
    this.nav.push(EntitiesPage, {});
  }
}
