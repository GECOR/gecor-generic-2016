import {NavController, NavParams, MenuController} from 'ionic-angular';
import {Page, ViewController, Platform} from 'ionic-angular';
import {forwardRef} from 'angular2/core';
import {AndroidAttribute} from './../../directives/global.helpers';
import {IncidentsPage} from './content/incidents/incidents';
import {NewIncPage} from './content/newInc/newInc';
import {FamiliesPage} from './content/newInc/families/families';
import {NewsPage} from './content/news/news';
import {SettingsPage} from './content/settings/settings';
import {GeolocationProvider} from './../../providers/geolocation';
import {HomePage} from './content/home/home';


@Page({
  templateUrl: './build/pages/tabs/tab-content.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class TabsContentPage {
  isAndroid: any;
  constructor(private platform: Platform
    , private menu: MenuController) {
    this.platform = platform;
    this.isAndroid = platform.is('android');

  }

  onPageDidEnter() {
  }


  onPageWillEnter() {
    console.log('enter');
    document.getElementById('md-tabs-icon-text').style.display = "block";
    document.getElementById('md-only').style.display = "none";
  }
}


@Page({
  templateUrl: './build/pages/tabs/tab-tabs.html',
  providers: [GeolocationProvider]
})
export class TabsPage {
  tabOne;
  tabTwo;
  tabThree;
  tabFour;
  tabFive;
  constructor(private geo: GeolocationProvider) {
    this.tabOne = IncidentsPage;
    this.tabTwo = FamiliesPage;
    this.tabThree = NewsPage;
    this.tabFour = SettingsPage;
    this.tabFive = HomePage;

    geo.getLocation().then(location =>{
      console.log(location);
    });
  }

  onPageWillLeave() {
    document.getElementById('md-tabs-icon-text').style.display = "none";
    document.getElementById('md-only').style.display = "block";
  }

}
