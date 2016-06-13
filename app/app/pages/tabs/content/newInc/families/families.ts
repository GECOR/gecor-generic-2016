import {Component, forwardRef, NgZone} from '@angular/core';
import {NavController, NavParams, MenuController, Storage, SqlStorage} from 'ionic-angular';
import {ViewController, Platform} from 'ionic-angular';
import {AndroidAttribute} from './../../../../../directives/global.helpers';
import {ConferenceData} from './../../../../../providers/conference-data';
import {NewIncPage} from './../newInc';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

@Component({
  templateUrl: './build/pages/tabs/content/newInc/families/families.html',
  directives: [forwardRef(() => AndroidAttribute)],
  pipes: [TranslatePipe]
})

export class FamiliesPage {
  isAndroid: any;
  familias: any = [];
  storage: any;
  lenFamilias: any;
  user: any = {};
  
  constructor(private platform: Platform
    , private menu: MenuController
    , private confData: ConferenceData
    , private nav: NavController
    , private _ngZone: NgZone ) {
    this.platform = platform;
    this.isAndroid = platform.is('android');
    
    this.storage = new Storage(SqlStorage);
    
  }
  
  ionViewWillEnter() {
    this.storage.get('familias').then((familias) => {
        this.familias = JSON.parse(familias);
        this.lenFamilias = this.familias.length;
    })
    
    this.storage.get('user').then((user) => {
        this.user = JSON.parse(user);
    })
  }
  
  openNewInc(familia){
    this.nav.push(NewIncPage, familia);
  }
  
  checkFamily(i){
      console.log(i);
  }
}
