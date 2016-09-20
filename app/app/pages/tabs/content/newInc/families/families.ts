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
import {Step2Page} from './../newIncStepByStep/step2/step2';

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
  tiposElementos: any;
  inc: any = {};

  exitOnBack: boolean = true;
  
  constructor(private platform: Platform
    , private menu: MenuController
    , private confData: ConferenceData
    , private nav: NavController
    , private _ngZone: NgZone
    , private db: DBProvider ) {
    this.platform = platform;
    this.isAndroid = platform.is('android');

    platform.registerBackButtonAction((event) => {
        if (this.exitOnBack){
            this.platform.exitApp();
        }
    }, 100);
  }

  ionViewWillLeave() {
    this.exitOnBack = false;
  }
  
  ionViewWillEnter() {
    this.exitOnBack = true;

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
    this.inc.familia = familia

    this.storage.get('tiposElementos').then((tiposElementos) => {
        this.tiposElementos = JSON.parse(tiposElementos);
        if (this.user.Aplicacion == 'G'){
          this.tiposElementos = this.tiposElementos.filter(item => item.FamiliaTipoElementoID == this.inc.familia.FamiliasTiposElementosID);
        }else{
          this.tiposElementos = this.tiposElementos.filter(item => item.FamiliaTipoElementoID == this.inc.familia.FamiliasTiposElementosID
          && item.EsInterno == false);
        }

        if (this.tiposElementos.length == 1){
          this.inc.tipoElemento = this.tiposElementos[0];
          this.nav.push(Step2Page, this.inc);
        }else{
          this.nav.push(Step1Page, this.inc);
        }
    });    
  }
  
  checkFamily(i){
      console.log(i);
  }
}