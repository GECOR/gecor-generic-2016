import {Component, NgZone} from '@angular/core';
import {NavController, NavParams, MenuController, Platform, Events} from 'ionic-angular';
import { FormControl } from '@angular/forms';
import {ConferenceData} from './../../../../../../providers/conference-data';
import {GeolocationProvider} from './../../../../../../providers/geolocation';
import {DBProvider} from './../../../../../../providers/db';
import {NewIncService} from './../../newIncService';
import {TranslateService} from 'ng2-translate/ng2-translate';
import {UtilsProvider} from './../../../../../../providers/utils';
import {Step2Page} from './../step2/step2';
import {Storage} from '@ionic/storage';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'ste1-page',
  templateUrl: 'step1.html',
  providers: [GeolocationProvider, NewIncService, UtilsProvider, DBProvider]
})
export class Step1Page {

  user: any = {};
  searchText: any;
  searchControl: FormControl;
  inc: any;
  tiposElementos: any;
  tiposElementosOriginal: any;
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
              this.tiposElementosOriginal = this.tiposElementos;
          });
      });
    
  }

  ionViewDidLoad() {
 
        this.searchControl.valueChanges.debounceTime(700).subscribe(search => { 
            this.searching = false;
            this.tiposElementos = this.filter(this.tiposElementosOriginal, search); 
        });

        console.log("tipoElemento => ", this.inc.tipoElemento);
 
  }

  filter(value, args){
    if (args){
      if (args.toLowerCase() != '') {
        return value.filter((item)=>
            item.DesTipoElemento.toLowerCase().indexOf(args.toLowerCase()) != -1
        );
      }
    }
    return value;
  }

  inputSearch($event) {
    //console.log(search.value);
    this.searching = true;
  }

  openIncidents(element){
    this.inc.tipoElemento = element;
    this.nav.push(Step2Page, this.inc);
  }

  openIncidentsWithoutElement(){
    this.nav.push(Step2Page, this.inc);
  }
  
}
