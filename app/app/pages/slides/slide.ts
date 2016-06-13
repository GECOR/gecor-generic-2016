import {Component, forwardRef} from '@angular/core';
import {NavController, MenuController, Storage, SqlStorage} from 'ionic-angular';
import {AndroidAttribute} from './../../directives/global.helpers';
import {LoginPage} from './../login/login';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

@Component({
    templateUrl: './build/pages/slides/slide.html',
    directives: [forwardRef(() => AndroidAttribute)],
    pipes: [TranslatePipe]
})
export class SlidePage {

  slides: any[];
  storage: any;

    constructor(private nav: NavController, private menu: MenuController) {
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
      
      // ADD FIRST RUN SUPPORT
      this.storage = new Storage(SqlStorage);
      
    }

  openLoginPage() {
    this.storage.set('firstRun', true);
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
