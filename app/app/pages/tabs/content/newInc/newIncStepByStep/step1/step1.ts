import {Component, forwardRef, NgZone, provide} from '@angular/core';
import {NavController, NavParams, MenuController, Alert, ActionSheet, ViewController, 
        Platform, Storage, SqlStorage, Events, Loading, Modal} from 'ionic-angular';
import {AndroidAttribute} from './../../../../../../directives/global.helpers';
import {ConferenceData} from './../../../../../../providers/conference-data';
import {marker} from './../../newIncInterface';
import {Geolocation, Camera, ImagePicker} from 'ionic-native';
import {IncidentsPage} from './../../../incidents/incidents';
import {SurveyPage} from './../../survey/survey';
import {GeolocationProvider} from './../../../../../../providers/geolocation';
import {DBProvider} from './../../../../../../providers/db';
import {NewIncService} from './../../newIncService';
import {GalleryModalPage} from './../../../../../galleryModal/galleryModal';
import {TranslatePipe, TranslateService} from 'ng2-translate/ng2-translate';
import {UtilsProvider} from './../../../../../../providers/utils';
import {defaultLanguage, folderLanguage, sourceLanguage, compareLanguage, useSQLiteOniOS} from './../../../../../../appConfig';
import {Step1SearchPipe} from './step1Pipe';
import {Step2Page} from './../step2/step2';

@Component({
  templateUrl: './build/pages/tabs/content/newInc/newIncStepByStep/step1/step1.html',
  directives: [forwardRef(() => AndroidAttribute)],
  providers: [GeolocationProvider, NewIncService, UtilsProvider, DBProvider],
  pipes: [TranslatePipe, Step1SearchPipe]
})
export class Step1Page {

  user: any = {};
  storage: any;
  searchText: any;
  inc: any;
  tiposElementos: any;
  
  constructor(private platform: Platform
    , private menu: MenuController
    , private confData: ConferenceData
    , private nav: NavController
    , private _ngZone: NgZone
    , private geo: GeolocationProvider
    , private params: NavParams
    , private newIncService: NewIncService
    , private utils: UtilsProvider
    , private translate : TranslateService
    , private events: Events
    , private db: DBProvider) {

      this.inc = params.data;
      this.searchText = '';

      this.storage = new Storage(SqlStorage);    
      this.storage.get('tiposElementos').then((tiposElementos) => {
          this.tiposElementos = JSON.parse(tiposElementos);
          this.tiposElementos = this.tiposElementos.filter(item => item.FamiliaTipoElementoID == this.inc.familia.FamiliasTiposElementosID);
      });
    
  }

  inputSearch(search) {
    console.log(search.value);
  }

  openIncidents(element){
    this.inc.tipoElemento = element;
    this.nav.push(Step2Page, this.inc);
  }
  
}
