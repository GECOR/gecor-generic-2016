import {Page, NavController, MenuController} from 'ionic-angular';
import {forwardRef} from '@angular/core';
import {AndroidAttribute} from './../../directives/global.helpers';
import {LoginPage} from './../login/login';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

@Page({
    templateUrl: './build/pages/signin/signin.html',
    directives: [forwardRef(() => AndroidAttribute)],
    pipes: [TranslatePipe]
})
export class SignInPage {

  constructor(private nav: NavController, private menu: MenuController) {

  }

  openLoginPage() {
    this.nav.push(LoginPage, {});
  }
}
