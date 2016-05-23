import {NavController, NavParams, MenuController, Storage, SqlStorage} from 'ionic-angular';
import {Page, ViewController, Platform} from 'ionic-angular';
import {forwardRef, NgZone} from '@angular/core';
import {AndroidAttribute} from './../../../../directives/global.helpers';
import {ConferenceData} from './../../../../providers/conference-data';
import {NotificationsPage} from './notifications/notifications';
import {TermsPage} from './terms/terms';
import {UserPage} from './user/user';
import {User} from './../../../login/LoginInterface';
import {EntitiesPage} from './entities/entities';



@Page({
  templateUrl: './build/pages/tabs/content/settings/settings.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class SettingsPage {
  user: any = {};
  constructor(private platform: Platform
    , private menu: MenuController
    , private confData: ConferenceData
    , private nav: NavController
    , private _ngZone: NgZone ) {

  }
  onPageWillEnter() {
    let storage = new Storage(SqlStorage);
    storage.get('user').then((user) => {
        this.user = JSON.parse(user);
    })
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
