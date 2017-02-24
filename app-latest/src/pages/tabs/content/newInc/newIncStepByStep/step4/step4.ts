import {Component, NgZone} from '@angular/core';
import {NavController, NavParams, MenuController, AlertController, 
        Platform, Events} from 'ionic-angular';
//import {AndroidAttribute} from './../../../../../../directives/global.helpers';
import {ConferenceData} from './../../../../../../providers/conference-data';
import {marker} from './../../newIncInterface';
import {GoogleMap, GoogleMapsEvent, GoogleMapsMarker, GoogleMapsMarkerOptions, GoogleMapsLatLng} from 'ionic-native';
import {GeolocationProvider} from './../../../../../../providers/geolocation';
import {DBProvider} from './../../../../../../providers/db';
import {NewIncService} from './../../newIncService';
import {TranslateService} from 'ng2-translate/ng2-translate';
import {UtilsProvider} from './../../../../../../providers/utils';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'step4-page',
  templateUrl: 'step4.html',
  providers: [GeolocationProvider, NewIncService, UtilsProvider, DBProvider]
})
export class Step4Page {

  user: any = {};
  //storage: any;
  inc: any;
  errorMessage: any;
  base64string = "data:image/jpeg;base64,";
  entity: any;
  loadingComponent: any;
  sendingInc: boolean = false;
  localizando: boolean = false;

  //MAP
  hideMap: boolean = true;
  mapShowedOnce: boolean = false;
  map: GoogleMap;
  marker: GoogleMapsMarker;
  latLng: GoogleMapsLatLng;
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
    , public alertCtrl: AlertController
    , public storage: Storage) {

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

      //this.storage = new Storage(SqlStorage);

      this.storage.get('user').then((user) => {
          this.user = JSON.parse(user);
      });

      this.localizando = true;
      this.geo.getLocation().then(location =>{
        this.localizando = false;
        this.location = location;
        if (!this.location.error){        
          this.latLng = this.location.latLng;
          this.inc.lat = this.latLng.lat;
          this.inc.lng = this.latLng.lng;
          this.inc.desUbicacion = this.location.startAddress;
          
          setTimeout(() => {
              this.initMap()
              //this.marker.setPosition(this.latLng);
              //this.map.setCenter(this.latLng);
            }
            , 100);
        }else{
          this.storage.get('entity').then((entity) => {
            this.entity = JSON.parse(entity);
            this.inc.tipoProcedenciaID = this.entity.ProcedenciaMovil;

            this.latLng = new GoogleMapsLatLng(this.entity.Latitud, this.entity.Longitud);
            this.inc.lat = this.entity.Latitud;
            this.inc.lng = this.entity.Longitud;
            this.inc.desUbicacion = this.translate.instant("incidents.incdetail.addresOf") + this.entity.Nombre; 

            setTimeout(() =>
              this.initMap()
            , 100); 
        });
        }
      });        
    
  }

  ionViewWillLeave(){
    this.mapShowedOnce = false;
  }

  ionViewDidEnter(){
    
  }

  ionViewWillEnter(){

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
    if (this.latLng){
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
    
    
  }

  initMap() {
    let mapEle = document.getElementById('mapInc');

    this.map = new GoogleMap(mapEle);
    this.map.setClickable(true);

    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
        this.map.clear();
        console.log('Map is ready!');
        this.map.setZoom(this.zoom);
        this.map.setCenter(this.latLng);

        let markerOptions: GoogleMapsMarkerOptions = {
          position: this.latLng,
          title: this.inc.desUbicacion,
          draggable: true
        };

        this.addMarker(this.map, markerOptions);

        this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe((e) =>{

          this.latLng = new GoogleMapsLatLng(e.lat, e.lng);
          this.inc.lat = e.lat;
          this.inc.lng = e.lng;

          this.map.clear();

          let markerOptions: GoogleMapsMarkerOptions = {
            position: this.latLng,
            title: this.inc.desUbicacion,
            draggable: true
          };

          this.addMarker(this.map, markerOptions);

        },
        error => {
            console.log(error);                            
        });
      }
    );
      
  }

  addMarker(map: GoogleMap, markerOptions: GoogleMapsMarkerOptions){
    map.addMarker(markerOptions)
          .then((marker: GoogleMapsMarker) => {
            //marker.showInfoWindow();
            marker.addEventListener(GoogleMapsEvent.MARKER_DRAG_END).subscribe((marker) =>{
              marker.getPosition((latLng) =>{
                this.latLng = new GoogleMapsLatLng(latLng.lat, latLng.lng);
                this.inc.lat = latLng.lat;
                this.inc.lng = latLng.lng;

                this.geo.getDirection(this.latLng).then(location =>{
                  this.location = location;
                  if (!this.location.error){
                    marker.setTitle(this.location.startAddress);
                    this.inc.desUbicacion = this.location.startAddress; 
                  }                   
                });
              });                   
              },
              error => {
                  console.log(error);                            
              });
              this.geo.getDirection(this.latLng).then(location =>{
                this.location = location;
                if (!this.location.error){
                  marker.setTitle(this.location.startAddress);
                  this.inc.desUbicacion = this.location.startAddress; 
                }                   
              });
          });
  }

  mapClass(){
    if (this.hideMap){
      //return "mapIncHidden";
      return "mapInc";
    }else{
      return "mapInc";
    }
  }

  newIncident(){
    this.map.setClickable(false);
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
            this.loadingComponent.onDidDismiss((inc) => {
              let navTransition = alert.dismiss();
              navTransition.then(() => { 
                this.sendingInc = false;
                if (inc[0].AvisoID != ""){
                  this.presentIncidentSuccess(inc[0].AvisoID == undefined ? inc[0].AvisoCiudadanoID : inc[0].AvisoID);
                }else{
                  this.showAlert(this.translate.instant("app.genericErrorAlertTitle"), this.translate.instant("newInc.presentConfirmErrorAlertMessage"), this.translate.instant("app.btnAccept"));
                }
              });
              
            });
            this.loadingComponent.present();
            this.sendingInc = true;        
            this.newIncService.nuevaIncidencia(this.user.token, this.inc.tipoElemento.TipoElementoID, this.inc.tipoIncidencia.TipoIncID, this.inc.desAveria,
            this.inc.lat, this.inc.lng, this.inc.calleID, this.inc.nomCalle, this.inc.numCalle, this.inc.desUbicacion, this.inc.edificioID, 
            this.inc.estadoAvisoID, this.inc.tipoProcedenciaID, this.inc.fotos, this.inc.tipoElemento.DesTipoElemento, this.inc.tipoIncidencia.TipoInc)
            .subscribe((inc) =>{              
              this.loadingComponent.dismiss(inc);              
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
            alert.dismiss();
            
            
            /*this.nav.push(FamiliesPage);
            setTimeout(() =>
              this.events.publish('tab:inc') 
            , 100);*/ 

            this.nav.popToRoot();

           /*if(this.platform.is('ios')){
              this.nav.push(FamiliesPage);
              setTimeout(() =>
                this.events.publish('tab:inc') 
              , 100); 
            }else{
              this.nav.push(TabsPage);
              setTimeout(() =>
                this.events.publish('tab:home') 
              , 100); 
            } */  
                       
          }
        }
      ]
    });
    alert.present();
  }
  
}
