import {Component, forwardRef} from '@angular/core';
import {Platform, NavController, Storage, SqlStorage, Events} from 'ionic-angular';
import {AndroidAttribute} from './../../../../directives/global.helpers';
import {ConferenceData} from './../../../../providers/conference-data';
import {DBProvider} from './../../../../providers/db';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {defaultLanguage, folderLanguage, sourceLanguage, compareLanguage, useSQLiteOniOS} from './../../../../appConfig';
import {InAppBrowser} from 'ionic-native';

@Component({
  templateUrl: 'build/pages/tabs/content/home/home.html',
  directives: [forwardRef(() => AndroidAttribute)],
  providers: [DBProvider],
  pipes: [TranslatePipe] 
})
export class HomePage {
  news: any[];
  storage: any;
  user: any = {};

  exitOnBack: boolean = true;
  
  constructor(private nav: NavController
  , private platform: Platform
  , private confData: ConferenceData
  , private events: Events
  , private db: DBProvider) {

    platform.registerBackButtonAction((event) => {
        if (this.exitOnBack){
            this.platform.exitApp();
        }
    }, 100);
    
    if(platform.is('ios') && useSQLiteOniOS){
      db.getValue('user').then((user) => {
          this.user = JSON.parse(user.toString());
      });      
    }else{
      this.storage = new Storage(SqlStorage);
      this.storage.get('user').then((user) => {
          this.user = JSON.parse(user);
      });
    }
  }

  ionViewWillLeave() {
    this.exitOnBack = false;
  }

  ionViewWillEnter() {
    this.exitOnBack = true;
  }

  openNewInc(){
    this.events.publish('tab:addInc');
  }

  openIncidents(){
    this.events.publish('tab:inc');
  }

  openUrl(url){
    //InAppBrowser.open(url, "_system", "location=yes");


    let browser = new InAppBrowser(url, "_system");
    //browser.show()
  }
}
