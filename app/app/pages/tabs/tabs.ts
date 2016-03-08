import {NavController, NavParams, MenuController} from 'ionic-framework/ionic';
import {Page, ViewController, Platform} from 'ionic-framework/ionic';
import {forwardRef} from 'angular2/core';
import {AndroidAttribute} from './../../directives/global.helpers';
import {IncidentsPage} from './content/incidents/incidents';
import {NewIncPage} from './content/newInc/newInc';
import {NewsPage} from './../news/news';
import {MapPage} from './../map/map';


@Page({
  /*template: '' +
  '<ion-navbar *navbar hideBackButton [attr.royal]="isAndroid ? \'\' : null">' +
  '<ion-title>Tabs</ion-title>' +
  '</ion-navbar>' +
  '<ion-content>' +
  '</ion-content>',*/
  templateUrl: './build/pages/tabs/tab-content.html',
  directives: [forwardRef(() => AndroidAttribute)],
})
export class TabsContentPage {
  isAndroid: any;
  activeMenu: any;
  constructor(private platform: Platform, private menu: MenuController) {
    this.platform = platform;
    this.isAndroid = platform.is('android');
    //this.menu1Active();
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
    /*this.menu.enable(true, 'menu1');
    this.menu.enable(false, 'menu2');
    this.menu.swipeEnable(true);*/
  }


  onPageWillEnter() {
    console.log('enter');
    document.getElementById('md-tabs-icon-text').style.display = "block";
    document.getElementById('md-only').style.display = "none";
  }
}


@Page({
  templateUrl: './build/pages/tabs/tab-tabs.html'
})
export class TabsPage {
  tabOne;
  tabTwo;
  tabThree;
  tabFour;
  constructor() {
    this.tabOne = IncidentsPage;
    this.tabTwo = NewIncPage;
    this.tabThree = NewsPage;
    this.tabFour = MapPage;
  }

  onPageWillLeave() {
    document.getElementById('md-tabs-icon-text').style.display = "none";
    document.getElementById('md-only').style.display = "block";
  }

}
