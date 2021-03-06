import {Component, ViewChild} from '@angular/core';
import {Events, Tabs} from 'ionic-angular';
import {Platform} from 'ionic-angular';
//import {AndroidAttribute} from './../../directives/global.helpers';
import {IncidentsPage} from './content/incidents/incidents';
import {FamiliesPage} from './content/newInc/families/families';
import {NewsPage} from './content/news/news';
import {SettingsPage} from './content/settings/settings';
import {GeolocationProvider} from './../../providers/geolocation';
import {HomePage} from './content/home/home';

@Component({
  selector: 'tabs-page',
  templateUrl: 'tab-tabs.html',
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
