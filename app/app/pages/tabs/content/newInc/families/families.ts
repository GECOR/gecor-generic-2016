import {Component, forwardRef, NgZone} from '@angular/core';
import {NavController, NavParams, MenuController, Storage, SqlStorage} from 'ionic-angular';
import {ViewController, Platform} from 'ionic-angular';
import {AndroidAttribute} from './../../../../../directives/global.helpers';
import {ConferenceData} from './../../../../../providers/conference-data';
import {DBProvider} from './../../../../../providers/db';
import {NewIncPage} from './../newInc';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {defaultLanguage, folderLanguage, sourceLanguage, compareLanguage, useSQLiteOniOS, newIncStepByStep} from './../../../../../appConfig';
import {Step1Page} from './../newIncStepByStep/step1/step1'

@Component({
  templateUrl: './build/pages/tabs/content/newInc/families/families.html',
  directives: [forwardRef(() => AndroidAttribute)],
  pipes: [TranslatePipe],
  providers: [DBProvider]
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
    , private _ngZone: NgZone
    , private db: DBProvider ) {
    this.platform = platform;
    this.isAndroid = platform.is('android');
  }
  
  ionViewWillEnter() {
    if(this.platform.is('ios') && useSQLiteOniOS){
      this.db.getValue('familias').then((familias) => {
          this.familias = JSON.parse(familias.toString());
          this.lenFamilias = this.familias.length;
      });

      this.db.getValue('user').then((user) => {
          this.user = JSON.parse(user.toString());
      });
    }else{
      this.storage = new Storage(SqlStorage);
      
      this.storage.get('familias').then((familias) => {
          this.familias = JSON.parse(familias);
          this.lenFamilias = this.familias.length;
      });
      
      this.storage.get('user').then((user) => {
          this.user = JSON.parse(user);
      });
    }
  }
  
  openNewInc(familia){
    //this.nav.push(NewIncPage, familia);
    var inc = {
      "familia": familia
    };
    this.nav.push(Step1Page, inc);
  }
  
  checkFamily(i){
      console.log(i);
  }
}