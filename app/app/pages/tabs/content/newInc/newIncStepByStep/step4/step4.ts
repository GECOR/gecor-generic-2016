import {Component, forwardRef, NgZone, provide} from '@angular/core';
import {NavController, NavParams, MenuController, AlertController, ViewController, 
        Platform, Storage, SqlStorage, Events} from 'ionic-angular';
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
import {TabsPage} from './../../../../../tabs/tabs';
import {FamiliesPage} from './../../families/families';

@Component({
  templateUrl: './build/pages/tabs/content/newInc/newIncStepByStep/step4/step4.html',
  directives: [forwardRef(() => AndroidAttribute)],
  providers: [GeolocationProvider, NewIncService, UtilsProvider, DBProvider],
  pipes: [TranslatePipe]
})
export class Step4Page {

  user: any = {};
  storage: any;
  inc: any;
  errorMessage: any;
  base64string = "data:image/jpeg;base64,";
  entity: any;
  loadingComponent: any;
  sendingInc: boolean = false;

  //MAP
  hideMap: boolean = true;
  mapShowedOnce: boolean = false;
  map: google.maps.Map;
  marker: google.maps.Marker;
  latLng: any;
  location: any;
  geocoderService: any;
  startAddress: string;
  zoom: number = 16;
  lat: any;
  lng: any;
  markers: marker[] = []
  //END MAP
  
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
    , public alertCtrl: AlertController) {

      platform.registerBackButtonAction((event) => {
        if (this.sendingInc){
          event.preventDefault();
        }
      }, 100);

      this.inc = params.data;
      this.inc.desAveria = "";
      this.inc.fotos = [];
      this.inc.edificioID = -1;
      this.inc.estadoAvisoID = -1;
      this.inc.tipoProcedenciaID = 2;
      this.inc.lat = 0.0;
      this.inc.lng = 0.0;
      this.inc.calleID = -1;
      this.inc.numCalle = 0;
      this.inc.nomCalle = "";

      this.storage = new Storage(SqlStorage);

      this.storage.get('user').then((user) => {
          this.user = JSON.parse(user);
      });

      this.storage.get('entity').then((entity) => {
          this.entity = JSON.parse(entity);
          this.inc.tipoProcedenciaID = this.entity.ProcedenciaMovil;
      });

      this.geo.getLocation().then(location =>{
        this.location = location;
        if (this.location.error){
          this.latLng = new google.maps.LatLng(this.entity.Latitud, this.entity.Longitud);
          this.inc.lat = this.entity.latitude;
          this.inc.lng = this.entity.longitude;
          this.inc.desUbicacion = this.translate.instant("incidents.incdetail.addresOf") + this.entity.Nombre;
        }else{        
          this.latLng = this.location.latLng;
          this.inc.lat = this.latLng.lat();
          this.inc.lng = this.latLng.lng();
          this.inc.desUbicacion = this.location.startAddress;
        }      
        //setTimeout(() =>
            //this.initMap()
          //, 100);      
      });  
    
  }

  inputSearch(search) {
    console.log(search.value);
  }

  showAlert(title, subTitle, okButton){
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: [okButton]
    });
    alert.present();
  }

  showMap(){
    if (!this.hideMap){
      this.hideMap=!this.hideMap;
    }else{
      let alert = this.alertCtrl.create({
        title: this.translate.instant("newInc.presentConfirmChangeLocAlertTitle"),
        message: this.translate.instant("newInc.presentConfirmChangeLocAlertMessage"),
        buttons: [
          {
            text: this.translate.instant("app.btnCancel"),
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: this.translate.instant("app.btnAccept"),
            handler: () => {
              this.hideMap=!this.hideMap;
              if(!this.hideMap && !this.mapShowedOnce){
                this.mapShowedOnce = true;
                this.initMap();
              }
            }
          }
        ]
      });    
      alert.present(); 
    }
    
  }

  initMap() {
    let mapEle = document.getElementById('mapInc');

      this.map = new google.maps.Map(mapEle, {
        center: this.latLng,
        zoom: this.zoom
      });        
      this.marker = new google.maps.Marker({
        position: this.latLng,
        map: this.map,
        title: this.inc.desUbicacion,
        draggable: true
      });      
      
      this.map.addListener('click', (e) => { 
        this.latLng = e.latLng;
        this.inc.lat = e.latLng.lat();
        this.inc.lng = e.latLng.lng();
        this.marker.setPosition(e.latLng);
                        
        this.geo.getDirection(e.latLng).then(location =>{
          this.location = location;
          if (!this.location.error){
            this.marker.setTitle(this.location.startAddress);
            this.inc.desUbicacion = this.location.startAddress; 
          }                   
        })               
      });
      
      this.marker.addListener('click', () => {
       //infoWindow.open(map, marker);
      });
      
      this.marker.addListener('dragend', (e) => {
        this.latLng = e.latLng;
        this.inc.lat = e.latLng.lat();
        this.inc.lng = e.latLng.lng();
        this.marker.setPosition(e.latLng);
                        
        this.geo.getDirection(e.latLng).then(location =>{
          this.location = location;
          if (!this.location.error){
            this.marker.setTitle(this.location.startAddress);
            this.inc.desUbicacion = this.location.startAddress; 
          }                   
        })        
      });
      
      google.maps.event.addListenerOnce(this.map, 'idle', () => {
        mapEle.classList.add('show-map');
      });
  }

  mapClass(){
    if (this.hideMap){
      return "mapIncHidden";
    }else{
      return "mapInc";
    }
  }

  newIncident(){
    if (this.checkFields()) this.presentConfirm();
  }

  checkFields(){
    var ok = true;
    
    if (this.inc.tipoElemento.tipoElementoID == -1){
      ok = false;
      this.showAlert(this.translate.instant("incidents.atentionAlertTitle"), this.translate.instant("newInc.elementAlertMessage"), this.translate.instant("app.btnAccept"));
      return ok;
    }
    
    if (this.inc.tipoIncidencia.tipoIncidenciaID == -1){
      ok = false;
      this.showAlert(this.translate.instant("incidents.atentionAlertTitle"), this.translate.instant("newInc.incidentAlertMessage"), this.translate.instant("app.btnAccept"));
      return ok;
    }
    
    if (this.inc.desAveria == ""){
      ok = false;
      this.showAlert(this.translate.instant("incidents.atentionAlertTitle"), this.translate.instant("newInc.descriptionAlertMessage"), this.translate.instant("app.btnAccept"));
      return ok;
    }
    
    return ok;
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: this.translate.instant("newInc.presentConfirmAlertTitle"),
      message: this.inc.tipoElemento.DesTipoElemento + ' - ' + this.inc.tipoIncidencia.TipoInc + '<br>' + this.inc.desUbicacion,
      buttons: [
        {
          text: this.translate.instant("app.btnCancel"),
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: this.translate.instant("app.sendBtn"),
          handler: () => {
            if(this.inc.imgs){
              this.inc.imgs.forEach(element => {
                let bf = "";//byteFoto
                let rf = "";//rutaFoto
                if (element.indexOf("http") > -1){
                  rf = element;
                }else{
                  bf = element;
                }
                this.inc.fotos.push({"byteFoto": bf, "rutaFoto": rf});//this.encodeImageUri(element)});
              });
            }
            this.loadingComponent = this.utils.getLoading(this.translate.instant("app.loadingMessage"));
            this.loadingComponent.present();
            this.sendingInc = true;        
            this.newIncService.nuevaIncidencia(this.user.token, this.inc.tipoElemento.TipoElementoID, this.inc.tipoIncidencia.TipoIncID, this.inc.desAveria,
            this.inc.lat, this.inc.lng, this.inc.calleID, this.inc.nomCalle, this.inc.numCalle, this.inc.desUbicacion, this.inc.edificioID, 
            this.inc.estadoAvisoID, this.inc.tipoProcedenciaID, this.inc.fotos, this.inc.tipoElemento.DesTipoElemento, this.inc.tipoIncidencia.TipoInc)
            .subscribe((inc) =>{
              this.sendingInc = false;
              this.loadingComponent.dismiss();
              if (inc[0].AvisoID != ""){
                this.presentIncidentSuccess(inc[0].AvisoID == undefined ? inc[0].AvisoCiudadanoID : inc[0].AvisoID);
              }else{
                this.showAlert(this.translate.instant("app.genericErrorAlertTitle"), this.translate.instant("newInc.presentConfirmErrorAlertMessage"), this.translate.instant("app.btnAccept"));
              }
            },
            error =>{
              this.sendingInc = false;
              this.loadingComponent.dismiss();
              this.errorMessage = <any>error;
            });
          }
        }
      ]
    });    
    alert.present();
  }

  presentIncidentSuccess(avisoID) {
    let alert = this.alertCtrl.create({
      title: this.translate.instant("newInc.presentIncidentSuccessAlertTitle"),
      message: "COD: " + avisoID,
      buttons: [
        {
          text: this.translate.instant("app.continueBtn"),
          role: 'cancel',
          handler: () => {
            if(this.platform.is('ios')){
              this.nav.push(FamiliesPage);
              setTimeout(() =>
                this.events.publish('tab:inc') 
              , 100); 
            }else{
              this.nav.push(TabsPage);
              setTimeout(() =>
                this.events.publish('tab:home') 
              , 100); 
            }   
                       
          }
        }
      ]
    });
    alert.present();
  }
  
}
