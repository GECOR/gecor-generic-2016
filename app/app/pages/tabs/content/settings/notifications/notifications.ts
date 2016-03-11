import {NavController, NavParams, MenuController} from 'ionic-angular';
import {Page, ViewController, Platform} from 'ionic-angular';
import {forwardRef, NgZone} from 'angular2/core';
import {AndroidAttribute} from './../../../../../directives/global.helpers';

@Page({
  templateUrl: './build/pages/tabs/content/settings/notifications/notifications.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class NotificationsPage {
  constructor(private platform: Platform
    , private menu: MenuController
    , private nav: NavController
    , private _ngZone: NgZone ) {

  }



}
