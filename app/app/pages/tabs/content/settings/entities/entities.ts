import {Page, NavController, MenuController, Alert} from 'ionic-angular';
import {forwardRef} from '@angular/core';
import {AndroidAttribute} from './../../../../../directives/global.helpers';
import {SettingsPage} from './../settings';

@Page({
  templateUrl: './build/pages/login/entities/entities.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class EntitiesPage {
    constructor(private nav: NavController
      , private menu: MenuController) {

    }

    chooseEntitie() {
      this.nav.push(SettingsPage);
    }

}
