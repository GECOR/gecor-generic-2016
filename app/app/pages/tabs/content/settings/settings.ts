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
import {defaultLanguage, folderLanguage, sourceLanguage, compareLanguage, useSQLiteOniOS} from './../../../../appConfig';

@Component({
  templateUrl: './build/pages/tabs/content/settings/settings.html',
  directives: [forwardRef(() => AndroidAttribute)],
  pipes: [TranslatePipe],
  providers: [DBProvider]
})
export class SettingsPage {
  user: any = {};
  exitOnBack: boolean = true;
  constructor(private platform: Platform
    , private menu: MenuController
    , private confData: ConferenceData
    , private nav: NavController
    , private _ngZone: NgZone
    , private db: DBProvider ) {


      platform.registerBackButtonAction((event) => {
          if (this.exitOnBack){
              this.platform.exitApp();
          }
      }, 100);

  }

  ionViewWillLeave() {
    this.exitOnBack = false;
  }

  ionViewWillEnter() {
    this.exitOnBack = true;
    if(this.platform.is('ios') && useSQLiteOniOS){
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
