import {Component, forwardRef, NgZone, Provider} from '@angular/core';
import {NavController, NavParams, MenuController, ViewController, 
        Platform, Events} from 'ionic-angular';
//import {AndroidAttribute} from './../../../../../../directives/global.helpers';
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
import {defaultLanguage, folderLanguage, sourceLanguage, compareLanguage, useSQLiteOniOS} from './../../../../../../app/appConfig';
import {Step1SearchPipe} from './step1Pipe';
import {Step2Page} from './../step2/step2';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'ste1-page',
  templateUrl: 'step1.html',
  //directives: [forwardRef(() => AndroidAttribute)],
  providers: [GeolocationProvider, NewIncService, UtilsProvider, DBProvider],
  //pipes: [TranslatePipe, Step1SearchPipe]
})
export class Step1Page {

  user: any = {};
  //storage: any;
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
    , private db: DBProvider
    , public storage: Storage) {

      this.inc = params.data;
      this.searchText = '';

      //this.storage = new Storage(SqlStorage);  

      this.storage.get('user').then((user) => {
          this.user = JSON.parse(user);

          this.storage.get('tiposElementos').then((tiposElementos) => {
              this.tiposElementos = JSON.parse(tiposElementos);
              if (this.user.Aplicacion == 'G'){
                this.tiposElementos = this.tiposElementos.filter(item => item.FamiliaTipoElementoID == this.inc.familia.FamiliasTiposElementosID);
              }else{
                this.tiposElementos = this.tiposElementos.filter(item => item.FamiliaTipoElementoID == this.inc.familia.FamiliasTiposElementosID
                && item.EsInterno == false);
              }
              
          });
      });
    
  }

  inputSearch(search) {
    //console.log(search.value);
  }

  openIncidents(element){
    this.inc.tipoElemento = element;
    this.nav.push(Step2Page, this.inc);
  }
  
}
