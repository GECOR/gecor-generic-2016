import {Component, forwardRef} from '@angular/core';
import {MenuController, NavController} from 'ionic-angular';
import {AndroidAttribute} from './../../directives/global.helpers';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

@Component({
  templateUrl: './build/pages/main/main-content.html',
  directives: [forwardRef(() => AndroidAttribute)],
  pipes: [TranslatePipe]
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

  ionViewDidEnter() {
    // the left menu should be disabled on the login page
    this.menu.enable(true);
    this.menu.swipeEnable(true);
  }
}
