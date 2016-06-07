import {ViewChild, Type, provide} from '@angular/core';
import {Http} from '@angular/http';
import {App, Platform, Storage, SqlStorage} from 'ionic-angular';
import {Splashscreen, Globalization} from 'ionic-native';
import {TranslateService, TranslateLoader, TranslateStaticLoader, TranslatePipe} from 'ng2-translate/ng2-translate';
import {ConferenceData} from './providers/conference-data';
import {GeolocationProvider} from './providers/geolocation';
import {UserData} from './providers/user-data';
import {SlidePage} from './pages/slides/slide';
import {TabsPage} from './pages/tabs/tabs';
import {defaultLanguage, folderLanguage, sourceLanguage, compareLanguage} from './appConfig';
// https://angular.io/docs/ts/latest/api/core/Type-interface.html

@App({
  templateUrl: './build/app.html',  
  config: {}, // http://ionicframework.com/docs/v2/api/config/Config/
  providers: [ConferenceData
              , UserData
              , GeolocationProvider
              , provide(TranslateLoader, {
                useFactory: (http: Http) => new TranslateStaticLoader(http, folderLanguage, sourceLanguage),
                deps: [Http]
              }),
              TranslateService
              ],
    pipes: [TranslatePipe]
})
export class MyApp {
  storage: any;
  translate: any;
  user: any;
  rootPage: Type;// = SlidePage;

  constructor(platform: Platform, confData: ConferenceData, geo: GeolocationProvider, translate: TranslateService) {
    // load the conference data
    confData.load();    
    this.storage = new Storage(SqlStorage);
    this.translate = translate;
    
    this.storage.get('user').then((user) => {
      if(user){        
        this.user = JSON.parse(user);
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
    
    Globalization.getPreferredLanguage().then((obj) =>{//get device language
      console.log(obj.value);
      this.initializeTranslateServiceConfig(obj.value.split('-')[0]);//initialize sending lowercase language
      this.storage.set('language', obj.value.split('-')[0]);
    }, (err)=>{
      console.log(err); 
      this.initializeTranslateServiceConfig(defaultLanguage);//initialize sending lowercase language default 
      this.storage.set('language', defaultLanguage);
    });
    
    //this.initializeTranslateServiceConfig();
    
    platform.ready().then(() => {});
  }
  
  initializeTranslateServiceConfig(lang) {
    //var userLang = compareLanguage.test(lang) ? lang : defaultLanguage;     
    this.translate.setDefaultLang(defaultLanguage);   
    this.translate.use(compareLanguage.test(lang) ? lang : defaultLanguage);
  }
  
}
