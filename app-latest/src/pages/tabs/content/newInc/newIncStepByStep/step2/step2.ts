import {Component, forwardRef, NgZone, Provider} from '@angular/core';
import {NavController, NavParams, MenuController, ViewController, 
        Platform, Events} from 'ionic-angular';
import { FormControl } from '@angular/forms';
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
//import {Step2SearchPipe} from './step2Pipe';
import {Step3Page} from './../step3/step3';
import {Storage} from '@ionic/storage';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'step2-page',
  templateUrl: 'step2.html',
  //directives: [forwardRef(() => AndroidAttribute)],
  providers: [GeolocationProvider, NewIncService, UtilsProvider, DBProvider],
  //pipes: [TranslatePipe, Step2SearchPipe]
})
export class Step2Page {

  user: any = {};
  //storage: any;
  searchText: any;
  searchControl: FormControl;
  inc: any;
  tiposIncidencias: any;
  tiposIncidenciasOriginal: any;
  searching: any = false;
  
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

      this.searchControl = new FormControl();

      //this.storage = new Storage(SqlStorage);    

      this.storage.get('user').then((user) => {
          this.user = JSON.parse(user);

          this.storage.get('tiposIncidencias').then((tiposIncidencias) => {
              this.tiposIncidencias = JSON.parse(tiposIncidencias);
              if (this.user.Aplicacion == 'G'){
                this.tiposIncidencias = this.tiposIncidencias.filter(item => item.TipoElementoID == this.inc.tipoElemento.TipoElementoID)
              }else{
                this.tiposIncidencias = this.tiposIncidencias.filter(item => item.TipoElementoID == this.inc.tipoElemento.TipoElementoID
                && item.EsInterno == false)
              }
              this.tiposIncidenciasOriginal = this.tiposIncidencias;
          })
      });
    
  }

  ionViewDidLoad() {
    this.searchControl.valueChanges.debounceTime(700).subscribe(search => { 
        this.searching = false;
        this.tiposIncidencias = this.filter(this.tiposIncidenciasOriginal, search); 
    });
  }

  filter(value, args:string){
    if (args){
      if (args.toLowerCase() != '') {
        return value.filter((item)=>
            item.TipoInc.toLowerCase().indexOf(args.toLowerCase()) != -1
        );
      }
    }
    return value;
  }

  inputSearch(search) {
    console.log(search.value);
    this.searching = true;
  }

  openChooseImg(incidencia){
    this.inc.tipoIncidencia = incidencia;
    this.nav.push(Step3Page, this.inc);
  }
  
}
