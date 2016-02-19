import {IonicApp, Page, MenuController, NavController} from 'ionic-framework/ionic';
import {forwardRef} from 'angular2/core';
import {AndroidAttribute} from './../../directives/global.helpers';

@Page({
  templateUrl: './build/pages/main/main-content.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class MainMenuContentPage {
  activeMenu;

  constructor(private menu: MenuController) {    
    this.menu1Active();
  }
  menu1Active() {
    this.activeMenu = 'menu1';
    this.menu.enable(true, 'menu1');
    this.menu.enable(false, 'menu2');
  }
  menu2Active() {
    this.activeMenu = 'menu2';
    this.menu.enable(false, 'menu1');
    this.menu.enable(true, 'menu2');
  }

  onPageDidEnter() {
    // the left menu should be disabled on the login page
    this.menu.enable(true);
    this.menu.swipeEnable(true);
  }
}
