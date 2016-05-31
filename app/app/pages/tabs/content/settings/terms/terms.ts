import {NavController, NavParams, MenuController, Storage, SqlStorage} from 'ionic-angular';
import {Page, ViewController, Platform} from 'ionic-angular';
import {forwardRef, NgZone} from '@angular/core';
import {AndroidAttribute} from './../../../../../directives/global.helpers';

@Page({
  templateUrl: './build/pages/tabs/content/settings/terms/terms.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class TermsPage {
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
