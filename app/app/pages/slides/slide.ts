import {Page, NavController, MenuController} from 'ionic-framework/ionic';
import {forwardRef} from 'angular2/core';
import {AndroidAttribute} from './../../directives/global.helpers';
import {LoginPage} from './../login/login';

@Page({
    templateUrl: './build/pages/slides/slide.html',
    directives: [forwardRef(() => AndroidAttribute)]
})
export class SlidePage {

  slides: any[];

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
    }

  openLoginPage() {
    this.nav.push(LoginPage);
  }

  onPageDidEnter() {
    // the left menu should be disabled on the login page
    this.menu.enable(false);
    this.menu.swipeEnable(false);
  }

  onPageDidLeave() {
    // enable the left menu when leaving the login page
    //this.menu.enable(true);
    //this.menu.swipeEnable(true);
  }
}
