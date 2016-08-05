import {Component, forwardRef, ViewChild} from '@angular/core';
import {NavController, NavParams, MenuController, Events, Tabs} from 'ionic-angular';
import {ViewController, Platform} from 'ionic-angular';
import {AndroidAttribute} from './../../directives/global.helpers';
import {IncidentsPage} from './content/incidents/incidents';
import {NewIncPage} from './content/newInc/newInc';
import {FamiliesPage} from './content/newInc/families/families';
import {NewsPage} from './content/news/news';
import {SettingsPage} from './content/settings/settings';
import {GeolocationProvider} from './../../providers/geolocation';
import {HomePage} from './content/home/home';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
/*
@Component({
  templateUrl: './build/pages/tabs/tab-content.html',
  directives: [forwardRef(() => AndroidAttribute)],
   pipes: [TranslatePipe]
})
export class TabsContentPage {
  isAndroid: any;
  constructor(private platform: Platform
    , private menu: MenuController) {
    this.platform = platform;
    this.isAndroid = platform.is('android');

  }

  ionViewDidEnter() {
  }


  ionViewWillEnter() {
    console.log('enter');
    document.getElementById('md-tabs-icon-text').style.display = "block";
    document.getElementById('md-only').style.display = "none";
  }
}
*/

@Component({
  templateUrl: './build/pages/tabs/tab-tabs.html',
  providers: [GeolocationProvider]
})
export class TabsPage {
  
  tabOne;
  tabTwo;
  tabThree;
  tabFour;
  tabFive;
  @ViewChild('myTabs') tabRef: Tabs;

  exitOnBack: boolean = true;
  
  constructor(private geo: GeolocationProvider
    , private events: Events
    , private platform: Platform) {
    this.tabOne = IncidentsPage;
    this.tabTwo = FamiliesPage;
    this.tabThree = NewsPage;
    this.tabFour = SettingsPage;
    this.tabFive = HomePage;

    platform.registerBackButtonAction((event) => {
        if (this.exitOnBack){
            this.platform.exitApp();
        }
    }, 100);
    
    this.listenToTabEvents();
  }

  ionViewWillLeave() {
    this.exitOnBack = false;
  }

  onPageWillLeave() {
    document.getElementById('md-tabs-icon-text').style.display = "none";
    document.getElementById('md-only').style.display = "block";
  }
  
  listenToTabEvents() {
    this.events.subscribe('tab:home', () => {
      this.tabRef.select(0);//home
    });

    this.events.subscribe('tab:inc', () => {
      this.tabRef.select(1);//Incidents
    });

    this.events.subscribe('tab:addInc', () => {
      this.tabRef.select(2);//Add incident
    });
    
    this.events.subscribe('tab:news', () => {
      this.tabRef.select(3);//News
    });
    
    this.events.subscribe('tab:settings', () => {
      this.tabRef.select(4);//Settings
    });    
  }

}
