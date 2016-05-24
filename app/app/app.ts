import {ViewChild, Type} from '@angular/core';
import {App, Platform, Storage, SqlStorage} from 'ionic-angular';
import {Splashscreen} from 'ionic-native';
import {ConferenceData} from './providers/conference-data';
import {GeolocationProvider} from './providers/geolocation';
import {UserData} from './providers/user-data';
import {SlidePage} from './pages/slides/slide';
import {TabsPage} from './pages/tabs/tabs';
// https://angular.io/docs/ts/latest/api/core/Type-interface.html

@App({
  templateUrl: './build/app.html',
  providers: [ConferenceData, UserData, GeolocationProvider],
  config: {} // http://ionicframework.com/docs/v2/api/config/Config/
})
export class MyApp {
  storage: any;
  user: any;
  rootPage: Type;// = SlidePage;

  constructor(platform: Platform, confData: ConferenceData, geo: GeolocationProvider) {
    // load the conference data
    confData.load();    
    this.storage = new Storage(SqlStorage);
    
    this.storage.get('user').then((user) => {
      if(user){        
        this.user = JSON.parse(user);      
        console.log(this.user); 
      }    
         
      if(this.user){
        if(this.user.token){
          this.rootPage = TabsPage;
        }else{
          this.rootPage = SlidePage;
        }
      }else{
        this.rootPage = SlidePage;
      }    
        
      Splashscreen.hide();           
    });
    
     platform.ready().then(() => {
        
      });
      
  }
}
