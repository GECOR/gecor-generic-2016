import {NavController, NavParams, MenuController} from 'ionic-angular';
import {Page, ViewController, Platform} from 'ionic-angular';
import {forwardRef, NgZone} from 'angular2/core';
import {AndroidAttribute} from './../../../../directives/global.helpers';
import {ConferenceData} from './../../../../providers/conference-data';
import {NotificationsPage} from './notifications/notifications';
import {TermsPage} from './terms/terms';
import {UserPage} from './user/user';



@Page({
  templateUrl: './build/pages/tabs/content/settings/settings.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class SettingsPage {
  constructor(private platform: Platform
    , private menu: MenuController
    , private confData: ConferenceData
    , private nav: NavController
    , private _ngZone: NgZone ) {

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

}
