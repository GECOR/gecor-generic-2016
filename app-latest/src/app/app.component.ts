import {Component} from '@angular/core';
import {Platform, Events} from 'ionic-angular';
import {Splashscreen, Globalization, Push} from 'ionic-native';
import {TranslateService} from 'ng2-translate';
import {SlidePage} from './../pages/slides/slide';
import {TabsPage} from './../pages/tabs/tabs';
import {LoginPage} from './../pages/login/login';
import {defaultLanguage, compareLanguage, useSQLiteOniOS} from './appConfig';
import {Storage} from '@ionic/storage';

@Component({
  template: `<ion-nav id="nav" [root]="rootPage" #content swipe-back-enabled="false"></ion-nav>`
})
export class MyApp {
  //storage: any;
  user: any;
  rootPage: any;// = SlidePage;
  push: any;

  constructor(private platform: Platform
  , private translate: TranslateService
  , private events: Events
  , public storage: Storage) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      /*StatusBar.styleDefault();
      Splashscreen.hide();*/

      if(platform.is('ios') && useSQLiteOniOS){
        this.initializeIosApp();
      }else{
        this.initializeApp();
      }

      document.addEventListener('resume', () => {
          this.push.setApplicationIconBadgeNumber(function() {
              console.log('success');
          }, function() {
              console.log('error');
          }, 0);
        });
      });
    }

    initializeApp(){
      // load the conference data
      //this.confData.load();    
      //this.storage = new Storage(SqlStorage);

      this.initializePush();

      this.storage.get('user').then((user) =>{
      if(user != "" && user != undefined){        
        this.user = JSON.parse(user.toString());
      }

      this.storage.get('firstRun').then((resp) => {
        if(this.user)
          this.rootPage = TabsPage;
        else if(resp != "" && user != undefined)
          this.rootPage = LoginPage;
        else
          this.rootPage = SlidePage;
      });
        
      Splashscreen.hide();

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
      //this.confData.load();    
      this.rootPage = SlidePage;

      this.initializePush();

      Globalization.getPreferredLanguage().then((obj) =>{//get device language
        console.log(obj.value);
        this.initializeTranslateServiceConfig(obj.value.split('-')[0]);//initialize sending lowercase language      
      }, (err)=>{
        console.log(err); 
        this.initializeTranslateServiceConfig(defaultLanguage);//initialize sending lowercase language default       
      });

      Splashscreen.hide();

    }

    initializePush(){
      this.platform.ready().then(() => {
          this.push = Push.init({
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
            this.push.on('registration', (data) => {
              console.log(data.registrationId);
            });
            this.push.on('notification', (data) => {
              console.log(data);       

              this.push.setApplicationIconBadgeNumber(function() {
                console.log('success');
              }, function() {
                console.log('error');
              }, data.count);

              if (!data.additionalData.foreground){
                this.events.publish('tab:inc');
                this.storage.set('incFromPush',  JSON.stringify({"id": data.additionalData.id, "time": data.additionalData.time}))
                setTimeout(() =>
                  this.events.publish('newPush')
                , 100);              
              }

            });
            this.push.on('error', (e) => {
              console.log(e.message);
            });
      });
    }

    initializeTranslateServiceConfig(lang) {
      //var userLang = compareLanguage.test(lang) ? lang : defaultLanguage;  
      this.translate.setDefaultLang(defaultLanguage);   
      this.translate.use(compareLanguage.test(lang) ? lang : defaultLanguage);
      
    }
  }
