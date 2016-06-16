import {Component, forwardRef, NgZone} from '@angular/core';
import {NavController, NavParams, MenuController, Storage, SqlStorage} from 'ionic-angular';
import {ViewController, Platform} from 'ionic-angular';
import {AndroidAttribute} from './../../../../../directives/global.helpers';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {DBProvider} from './../../../../../providers/db';

@Component({
  templateUrl: './build/pages/tabs/content/settings/terms/terms.html',
  directives: [forwardRef(() => AndroidAttribute)],
  pipes: [TranslatePipe],
  providers: [DBProvider]
})
export class TermsPage {
  user: any = {};
  
  constructor(private platform: Platform
    , private menu: MenuController
    , private nav: NavController
    , private _ngZone: NgZone
    , private db: DBProvider ) {
      
    let storage = new Storage(SqlStorage);
    /*storage.get('user').then((user) => {
        this.user = JSON.parse(user);
    })*/
    this.db.getValue('user').then((user) => {
        this.user = JSON.parse(user.toString());
    });

  }



}
