import {Component, forwardRef, Type} from '@angular/core';
import {Platform, NavController, MenuController, Storage, SqlStorage} from 'ionic-angular';
import {AndroidAttribute} from './../../directives/global.helpers';
import {LoginPage} from './../login/login';
import {DBProvider} from './../../providers/db';
import {Globalization} from 'ionic-native';
import {TranslateService, TranslateLoader, TranslateStaticLoader, TranslatePipe} from 'ng2-translate/ng2-translate';
import {defaultLanguage, folderLanguage, sourceLanguage, compareLanguage, useSQLiteOniOS} from './../../appConfig';
import {TabsPage} from '../tabs/tabs';
 
@Component({
    templateUrl: './build/pages/slides/slide.html',
    directives: [forwardRef(() => AndroidAttribute)],
    providers: [DBProvider],
    pipes: [TranslatePipe]
})
export class SlidePage {

  slides: any[];
  storage: any;
  user: any;
  rootPage: Type;

    constructor(private nav: NavController
    , private menu: MenuController
    , private platform: Platform
    , private translate: TranslateService
    , private db: DBProvider) {
      this.slides = [
        {
          title: "Welcome to the Docs!",
          description: "The <b>Ionic Component Documentation</b> showcases a number of useful components that are included out of the box with Ionic.",
          image: "img/ica-slidebox-img-1.png",
        },
        {
          title: "What is Ionic?",
          description: "<b>Ionic Framework</b> is an open source SDK that enables developers to build high quality mobile apps with web technologies like HTML, CSS, and JavaScript.",
          image: "img/ica-slidebox-img-2.png",
        },
        {
          title: "What is Ionic Platform?",
          description: "The <b>Ionic Platform</b> is a cloud platform for managing and scaling Ionic apps with integrated services like push notifications, native builds, user auth, and live updating.",
          image: "img/ica-slidebox-img-3.png",
        }
      ];
    }

  openLoginPage() {
    if(this.platform.is('ios') && useSQLiteOniOS){
      this.db.setKey('firstRun', 'true').then((result) =>{
          console.log(result);                                                                 
          },
          error =>{
          console.log(error);
      });
    }else{
      this.storage = new Storage(SqlStorage);
      this.storage.set('firstRun', true);
    }
    
    this.nav.push(LoginPage);
  }

  ionViewDidEnter() {
    // the left menu should be disabled on the login page
    this.menu.enable(false);
    this.menu.swipeEnable(false);
  }

  ionViewDidLeave() {
    // enable the left menu when leaving the login page
    //this.menu.enable(true);
    //this.menu.swipeEnable(true);
  }
}
