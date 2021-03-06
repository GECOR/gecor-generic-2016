import {Component} from '@angular/core';
import {Platform, NavController, Events} from 'ionic-angular';
//import {AndroidAttribute} from './../../../../directives/global.helpers';
import {ConferenceData} from './../../../../providers/conference-data';
import {DBProvider} from './../../../../providers/db';
import {useSQLiteOniOS} from './../../../../app/appConfig';
import {InAppBrowser} from 'ionic-native';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'home-page',
  templateUrl: 'home.html',
  //directives: [forwardRef(() => AndroidAttribute)],
  providers: [DBProvider],
  //pipes: [TranslatePipe] 
})
export class HomePage {
  news: any[];
  //storage: any;
  user: any = {};

  exitOnBack: boolean = true;
  
  constructor(private nav: NavController
  , private platform: Platform
  , private confData: ConferenceData
  , private events: Events
  , private db: DBProvider
  , public storage: Storage) {

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
      //this.storage = new Storage(SqlStorage);
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
    new InAppBrowser(url, "_system");
  }
}
