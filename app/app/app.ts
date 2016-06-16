import {Component, ViewChild, Type, provide} from '@angular/core';
import {Http} from '@angular/http';
import {ionicBootstrap, Platform, Storage, SqlStorage} from 'ionic-angular';
import {Splashscreen, Globalization} from 'ionic-native';
import {TranslateService, TranslateLoader, TranslateStaticLoader, TranslatePipe} from 'ng2-translate/ng2-translate';
import {ConferenceData} from './providers/conference-data';
import {GeolocationProvider} from './providers/geolocation';
import {DBProvider} from './providers/db';
import {UserData} from './providers/user-data';
import {SlidePage} from './pages/slides/slide';
import {TabsPage} from './pages/tabs/tabs';
import {LoginPage} from './pages/login/login';
import {defaultLanguage, folderLanguage, sourceLanguage, compareLanguage} from './appConfig';
// https://angular.io/docs/ts/latest/api/core/Type-interface.html

@Component({
  templateUrl: './build/app.html',  
  /*providers: [ConferenceData
              , UserData
              , GeolocationProvider
              , provide(TranslateLoader, {
                useFactory: (http: Http) => new TranslateStaticLoader(http, folderLanguage, sourceLanguage),
                deps: [Http]
              }),
              TranslateService
              ],*/
    providers: [DBProvider],
    pipes: [TranslatePipe]
})
export class MyApp {
  storage: any;
  user: any;
  rootPage: Type;// = SlidePage;

  constructor(platform: Platform
  , private confData: ConferenceData
  , private geo: GeolocationProvider
  , private translate: TranslateService
  , private db: DBProvider) {
    
    //platform.ready().then(() => {
      this.initializeApp();
    //});
  }

  initializeApp(){
    // load the conference data
    this.confData.load();    
    this.storage = new Storage(SqlStorage);

    this.rootPage = SlidePage;

    /*this.db.initDB().then((result) =>{
        console.log(result);
        this.db.getValue('user').then((user) =>{
        if(user != ""){        
          this.user = JSON.parse(user.toString());
        }

        this.db.getValue('firstRun').then((resp) => {
          if(this.user)
            this.rootPage = TabsPage;
          else if(resp != "")
            this.rootPage = LoginPage;
          else
            this.rootPage = SlidePage;
        });
          
        Splashscreen.hide();  
    });

    Globalization.getPreferredLanguage().then((obj) =>{//get device language
      console.log(obj.value);
      this.initializeTranslateServiceConfig(obj.value.split('-')[0]);//initialize sending lowercase language
      //this.storage.set('language', obj.value.split('-')[0]);
      this.db.setKey('language', obj.value.split('-')[0]).then((result) =>{
        console.log(result);                                                                 
        },
        error =>{
          console.log(error);
      });
    }, (err)=>{
      console.log(err); 
      this.initializeTranslateServiceConfig(defaultLanguage);//initialize sending lowercase language default 
      //this.storage.set('language', defaultLanguage);
      this.db.setKey('language', defaultLanguage).then((result) =>{
        console.log(result);                                                                 
        },
        error =>{
          console.log(error);
      });
    });
    
    //this.initializeTranslateServiceConfig();                                                                
    },
    error =>{
      console.log(error);
    });*/
  }
  
  initializeTranslateServiceConfig(lang) {
    //var userLang = compareLanguage.test(lang) ? lang : defaultLanguage;     
    this.translate.setDefaultLang(defaultLanguage);   
    this.translate.use(compareLanguage.test(lang) ? lang : defaultLanguage);
  }
  
}

// Pass the main App component as the first argument
// Pass any providers for your app in the second argument
// Set any config for your app as the third argument, see the docs for
// more ways to configure your app:
// http://ionicframework.com/docs/v2/api/config/Config/
// Place the tabs on the bottom for all platforms
// See the theming docs for the default values:
// http://ionicframework.com/docs/v2/theming/platform-specific-styles/

ionicBootstrap(MyApp, [ConferenceData
                      , UserData
                      , GeolocationProvider
                      , provide(TranslateLoader, {
                        useFactory: (http: Http) => new TranslateStaticLoader(http, folderLanguage, sourceLanguage),
                        deps: [Http]
                      }),
                      TranslateService
                      ], {
                        tabbarPlacement: 'bottom'
                      });