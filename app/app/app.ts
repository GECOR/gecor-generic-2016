import {Component, ViewChild, Type, provide} from '@angular/core';
import {Http} from '@angular/http';
import {ionicBootstrap, Platform, Storage, SqlStorage} from 'ionic-angular';
import {Splashscreen, Globalization} from 'ionic-native';//, Push
import {TranslateService, TranslateLoader, TranslateStaticLoader, TranslatePipe} from 'ng2-translate/ng2-translate';
import {ConferenceData} from './providers/conference-data';
import {GeolocationProvider} from './providers/geolocation';
import {DBProvider} from './providers/db';
import {UserData} from './providers/user-data';
import {SlidePage} from './pages/slides/slide';
import {TabsPage} from './pages/tabs/tabs';
import {LoginPage} from './pages/login/login';
import {defaultLanguage, folderLanguage, sourceLanguage, compareLanguage, useSQLiteOniOS} from './appConfig';
// https://angular.io/docs/ts/latest/api/core/Type-interface.html

@Component({
  templateUrl: './build/app.html',
    providers: [DBProvider],
    pipes: [TranslatePipe]
})
export class MyApp {
  storage: any;
  user: any;
  rootPage: Type;// = SlidePage;

  constructor(private platform: Platform
  , private confData: ConferenceData
  , private geo: GeolocationProvider
  , private translate: TranslateService
  , private db: DBProvider) {  

    platform.ready().then(() => {
      if(platform.is('ios') && useSQLiteOniOS){
        this.initializeIosApp();
      }else{
        this.initializeApp();
      }
    }); 

  }

  initializeApp(){
    // load the conference data
    this.confData.load();    
    this.storage = new Storage(SqlStorage);

    //this.initializePush();

    this.db.initDB().then((result) =>{
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
      this.storage.set('language', obj.value.split('-')[0]);      
    }, (err)=>{
      console.log(err); 
      this.initializeTranslateServiceConfig(defaultLanguage);//initialize sending lowercase language default 
      this.storage.set('language', defaultLanguage);      
    });    
    //this.initializeTranslateServiceConfig();                                                                
    },
    error =>{
      console.log(error);
    });
  }
  
  initializeIosApp(){
    this.confData.load();    
    this.rootPage = SlidePage;

    //this.initializePush();

    Globalization.getPreferredLanguage().then((obj) =>{//get device language
      console.log(obj.value);
      this.initializeTranslateServiceConfig(obj.value.split('-')[0]);//initialize sending lowercase language      
    }, (err)=>{
      console.log(err); 
      this.initializeTranslateServiceConfig(defaultLanguage);//initialize sending lowercase language default       
    });

    Splashscreen.hide();

  }

  /*initializePush(){
     this.platform.ready().then(() => {
        var push = Push.init({
            android: {
              senderID: "1060313159714"
            },
            ios: {
              alert: "true",
              badge: true,
              sound: 'false'
            },
            windows: {}
          });
          push.on('registration', (data) => {
            console.log(data.registrationId);
            alert(data.registrationId.toString());
          });
          push.on('notification', (data) => {
            console.log(data);
            alert("Hi, Am a push notification");
          });
          push.on('error', (e) => {
            console.log(e.message);
          });
     });
  }*/

  initializeTranslateServiceConfig(lang) {
    //var userLang = compareLanguage.test(lang) ? lang : defaultLanguage;     
    this.translate.setDefaultLang(defaultLanguage);   
    this.translate.use(compareLanguage.test(lang) ? lang : defaultLanguage);
  }
  
}

//Bootstrap(start) the app
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