import {Page, NavController, MenuController, Alert, NavParams} from 'ionic-angular';
import {forwardRef} from '@angular/core';
import {AndroidAttribute} from './../../../directives/global.helpers';
import {LoginPage} from './../login';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

@Page({
  templateUrl: './build/pages/login/entities/entities.html',
  directives: [forwardRef(() => AndroidAttribute)],
   pipes: [TranslatePipe]
})
export class EntitiesPage {
    aytos: any[];
    aytoSuggested: any;
    constructor(private nav: NavController
      , private menu: MenuController
      , private params: NavParams) {
          
          this.aytos = params.data;
          this.aytoSuggested = this.aytos[0];
          this.aytos.shift();
          console.log(this.aytos);
    }

    chooseEntitie() {
      this.nav.push(LoginPage);
    }

}
