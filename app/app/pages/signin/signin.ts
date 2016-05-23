import {Page, NavController, MenuController} from 'ionic-angular';
import {forwardRef} from '@angular/core';
import {AndroidAttribute} from './../../directives/global.helpers';
import {LoginPage} from './../login/login';

@Page({
    templateUrl: './build/pages/signin/signin.html',
    directives: [forwardRef(() => AndroidAttribute)]
})
export class SignInPage {

  constructor(private nav: NavController, private menu: MenuController) {

  }

  openLoginPage() {
    this.nav.push(LoginPage, {});
  }
}
