import {NavController, NavParams, MenuController} from 'ionic-angular';
import {Page, ViewController, Platform} from 'ionic-angular';
import {forwardRef, NgZone} from 'angular2/core';
import {AndroidAttribute} from './../../../../../directives/global.helpers';
import {ConferenceData} from './../../../../../providers/conference-data';
import {NewIncPage} from './../newInc';

@Page({
  templateUrl: './build/pages/tabs/content/newInc/families/families.html',
  directives: [forwardRef(() => AndroidAttribute)]
})

export class FamiliesPage {
  isAndroid: any;
  families: any;
  constructor(private platform: Platform
    , private menu: MenuController
    , private confData: ConferenceData
    , private nav: NavController
    , private _ngZone: NgZone ) {
    this.platform = platform;
    this.isAndroid = platform.is('android');
    
    confData.getFamilies().then(families =>{
      this.families = families;
    });
  }
  
  openNewInc(){
    this.nav.push(NewIncPage, {});
  }
  
  checkFamily(i){
      console.log(i);
  }
}
