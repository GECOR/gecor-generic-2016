import {Component, forwardRef, NgZone, Provider} from '@angular/core';
import {NavController, NavParams, MenuController, AlertController, ActionSheetController, ViewController, 
        Platform, Events, ModalController} from 'ionic-angular';
import {AndroidAttribute} from './../../../../directives/global.helpers';
import {ConferenceData} from './../../../../providers/conference-data';
import {marker} from './newIncInterface';
import {Geolocation, Camera, ImagePicker} from 'ionic-native';
import {IncidentsPage} from './../incidents/incidents';
import {SurveyPage} from './survey/survey';
import {GeolocationProvider} from './../../../../providers/geolocation';
import {DBProvider} from './../../../../providers/db';
import {NewIncService} from './newIncService';
import {GalleryModalPage} from './../../../galleryModal/galleryModal';
import {TranslatePipe, TranslateService} from 'ng2-translate/ng2-translate';
import {UtilsProvider} from './../../../../providers/utils';
import {defaultLanguage, folderLanguage, sourceLanguage, compareLanguage, useSQLiteOniOS} from './../../../../app/appConfig';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'new-inc-page',
  templateUrl: 'newInc.html',
  //directives: [forwardRef(() => AndroidAttribute)],
  providers: [GeolocationProvider, NewIncService, UtilsProvider, DBProvider],
  //pipes: [TranslatePipe]
})
export class NewIncPage {
  isAndroid: any;
  activeMenu: any;
  images: any;
  uploadingImages: any;
  familia: any;
  tiposElementos: any;
  tiposIncidencias: any;
  //storage: any;
  errorMessage: any;
  loadingComponent: any;
  newInc: any = {
    "tipoElementoID": -1,
    "desTipoElemento": "",
    "tipoIncidenciaID": -1,
    "desTipoIncidencia": "",
    "desAveria": "",
    "lat": 0.0,
    "lng": 0.0,
    "calleID": -1,
    "nomCalle": "",
    "numCalle": 0,
    "desUbicacion": "",
    "edificioID": -1,
    "estadoAvisoID": -1,
    "tipoProcedenciaID": 2, //Móvil
    "fotos": []
  };
  user: any = {};
  entity: any = {};
  hideMap: boolean = true;
  mapShowedOnce: boolean = false;
  
  //MAP
  map: google.maps.Map;
  marker: google.maps.Marker;
  latLng: any;
  location: any;
  geocoderService: any;
  startAddress: string;
  // google maps zoom level
  zoom: number = 16;
  // initial center position for the map
  lat: any;
  lng: any;
  markers: marker[] = []
  //END MAP
  maximumImages = 5;
  base64string = "data:image/jpeg;base64,";
  
  
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
    , public modalCtrl: ModalController
    , public alertCtrl: AlertController
    , public actionSheetCtrl: ActionSheetController
    , public storage: Storage) {
  
    this.platform = platform;
    this.isAndroid = platform.is('android');
    this.images = ["", "", "", ""];
    this.uploadingImages = [false, false, false, false];
    this.familia = params.data;
    
    this.loadingComponent = utils.getLoading(this.translate.instant("app.loadingMessage"));
    
    if(platform.is('ios') && useSQLiteOniOS){
       this.db.getValue('tiposElementos').then((tiposElementos) => {
          this.tiposElementos = JSON.parse(tiposElementos.toString());
          this.tiposElementos = this.tiposElementos.filter(item => item.FamiliaTipoElementoID == this.familia.FamiliasTiposElementosID);
      });
      this.db.getValue('user').then((user) => {
          this.user = JSON.parse(user.toString());
      });
      this.db.getValue('entity').then((entity) => {
          this.entity = JSON.parse(entity.toString());
          this.newInc.tipoProcedenciaID = this.entity.ProcedenciaMovil;
      });
    }else{
      //this.storage = new Storage(SqlStorage);    
      this.storage.get('tiposElementos').then((tiposElementos) => {
          this.tiposElementos = JSON.parse(tiposElementos);
          this.tiposElementos = this.tiposElementos.filter(item => item.FamiliaTipoElementoID == this.familia.FamiliasTiposElementosID);
      });
      this.storage.get('user').then((user) => {
          this.user = JSON.parse(user);
      });
      this.storage.get('entity').then((entity) => {
          this.entity = JSON.parse(entity);
          this.newInc.tipoProcedenciaID = this.entity.ProcedenciaMovil;
      });
    }
    
    this.geo.getLocation().then(location =>{
      this.location = location;
      if (this.location.error){
        this.latLng = new google.maps.LatLng(this.entity.Latitud, this.entity.Longitud);
        this.newInc.lat = this.entity.latitude;
        this.newInc.lng = this.entity.longitude;
        this.newInc.desUbicacion = this.translate.instant("incidents.incdetail.addresOf") + this.entity.Nombre;
      }else{        
        this.latLng = this.location.latLng;
        this.newInc.lat = this.latLng.lat();
        this.newInc.lng = this.latLng.lng();
        this.newInc.desUbicacion = this.location.startAddress;
      }      
      //setTimeout(() =>
          //this.initMap()
        //, 100);      
    });    
  }

  //MAP

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
        title: this.newInc.desUbicacion,
        draggable: true
      });      
      
      this.map.addListener('click', (e) => { 
        this.latLng = e.latLng;
        this.newInc.lat = e.latLng.lat();
        this.newInc.lng = e.latLng.lng();
        this.marker.setPosition(e.latLng);
                        
        this.geo.getDirection(e.latLng).then(location =>{
          this.location = location;
          if (!this.location.error){            
            /*this.latLng = this.location.latLng;
            this.newInc.lat = this.latLng.lat();
            this.newInc.lng = this.latLng.lng();
            this.marker.setPosition(this.location.latLng);*/
            this.marker.setTitle(this.location.startAddress);
            //infoWindow.setContent(`<h5>${resp.startAddress}</h5>`)
            this.newInc.desUbicacion = this.location.startAddress; 
          }                   
        })               
      });
      
      this.marker.addListener('click', () => {
       //infoWindow.open(map, marker);
      });
      
      this.marker.addListener('dragend', (e) => {       
       /*this.geo.getDirection(e.latLng).then(resp =>{
          this.marker.setPosition(this.location.latLng);
          this.marker.setTitle(this.location.startAddress);
          //infoWindow.setContent(`<h5>${resp.startAddress}</h5>`)
          this.newInc.desUbicacion = this.location.startAddress;          
        })*/
        this.latLng = e.latLng;
        this.newInc.lat = e.latLng.lat();
        this.newInc.lng = e.latLng.lng();
        this.marker.setPosition(e.latLng);
                        
        this.geo.getDirection(e.latLng).then(location =>{
          this.location = location;
          if (!this.location.error){            
            /*this.latLng = this.location.latLng;
            this.newInc.lat = this.latLng.lat();
            this.newInc.lng = this.latLng.lng();
            this.marker.setPosition(this.location.latLng);*/
            this.marker.setTitle(this.location.startAddress);
            //infoWindow.setContent(`<h5>${resp.startAddress}</h5>`)
            this.newInc.desUbicacion = this.location.startAddress; 
          }                   
        })        
      });
      
      google.maps.event.addListenerOnce(this.map, 'idle', () => {
        mapEle.classList.add('show-map');
      });
  }
  
  centerMap(){
    this.geo.getLocation().then(location => {
      this.location = location;
      if (this.location.error){
        this.latLng = new google.maps.LatLng(this.entity.Latitud, this.entity.Longitud);
        this.newInc.lat = this.entity.latitude;
        this.newInc.lng = this.entity.longitude;
        this.newInc.desUbicacion = this.translate.instant("incidents.incdetail.addresOf") + this.entity.Nombre;
        this.map.setCenter(this.latLng);
        this.marker.setPosition(this.latLng);
        this.marker.setTitle(this.translate.instant("incidents.incdetail.addresOf") + this.entity.Nombre);
      }else{        
        this.latLng = this.location.latLng;
        this.newInc.lat = this.latLng.lat();
        this.newInc.lng = this.latLng.lng();
        this.newInc.desUbicacion = this.location.startAddress;
        this.map.setCenter(this.latLng);
        this.marker.setPosition(this.location.latLng);
        this.marker.setTitle(this.location.startAddress);
      }    
    }); 
  }

  //END MAP

  takePhoto(id){
    let actionSheet = this.actionSheetCtrl.create({
      title: '',
      buttons: [
        {
          text: this.translate.instant("app.galleryText"),
          handler: () => {
          this.uploadingImages[id] = true;
          ImagePicker.getPictures({maximumImagesCount: 1}).then((results) => {
                    /*
                    for (var i = 0; i < results.length; i++) {
                        //console.log('Image URI: ' + results[i]);
                        this._ngZone.run(() => {
                          this.images[i] = results[i];
                        });
                    }
                    */
                    if (results.length > 0){
                      this.utils.resizeImage(results[0], 1024, 768).then((imgResized) => {
                        this.uploadImage(imgResized, id);
                      });
                    }else{
                      this.uploadingImages[id] = false;
                    }
                    
                    
                }, (error) => {
                    console.log('Error: ' + error);
                    this.uploadingImages[id] = false;
                }
            );
          }
        },
        {
          text: this.translate.instant("app.cameraText"),
          handler: () => {
            this.uploadingImages[id] = true;            
            Camera.getPicture({quality: 100, destinationType: Camera.DestinationType.DATA_URL}).then((imageURI) => {//, destinationType: Camera.DestinationType.DATA_URL
              //this.images[id] = this.base64string + imageURI;
              //this.uploadImage(this.base64string + imageURI, id);
              this.utils.resizeImage(this.base64string + imageURI, 1024, 768).then((imgResized) => {
                this.uploadImage(imgResized, id);
              });
            }, (message) => {
              this.showAlert(this.translate.instant("app.genericErrorAlertTitle"), this.translate.instant("app.cameraErrorAlertMessage"), this.translate.instant("app.btnAccept"));
              console.log('Failed because: ' + message);
              this.uploadingImages[id] = false;
              console.log(message);
            });
          }
        },
        {
          text: this.translate.instant("app.btnCancel"),
          role: 'cancel',
          handler: () => {
            console.log("Cancel clicked");
            this.uploadingImages[id] = false;
          }
        }
      ]
    });
    actionSheet.present();
  }
 
  
  encodeImageUri(imageUri){//image from uri to base64 --> used in gallery

    return new Promise((resolve, reject) => {
      var c=document.createElement('canvas');
      var ctx=c.getContext("2d");
      var img=new Image();
      img.src=imageUri;
      img.onload = () => {
        c.width=img.width;
        c.height=img.height;
        ctx.drawImage(img, 0,0);
        resolve(c.toDataURL("image/jpeg"));
      };
    });
  }
  
  uploadImage(imgBase64, id){
    if (imgBase64 != ""){
      this.newIncService.guardarFotoBase64(this.user.token, imgBase64)
      .subscribe((result) =>{
        //this.loadingComponent.dismiss();
        if (result.rutaFoto){
          //this.presentIncidentSuccess();
          console.log(result);
          this._ngZone.run(() => {
            this.images[id] = result.rutaFoto;//results[0];
          });
          this.uploadingImages[id] = false;
        }else{
          this.showAlert(this.translate.instant("app.genericErrorAlertTitle"), this.translate.instant("newInc.presentConfirmErrorAlertMessage"), this.translate.instant("app.btnAccept"));
        }
      },
      error =>{
        //this.loadingComponent.dismiss();
        this.errorMessage = <any>error;
      });
    }
  }
  
  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: this.translate.instant("newInc.presentConfirmAlertTitle"),
      message: this.newInc.desTipoElemento + ' - ' + this.newInc.desTipoIncidencia + '<br>' + this.newInc.desUbicacion,
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
            if(this.images){
              this.images.forEach(element => {
                let bf = "";//byteFoto
                let rf = "";//rutaFoto
                if (element.indexOf("http") > -1){
                  rf = element;
                }else{
                  bf = element;
                }
                this.newInc.fotos.push({"byteFoto": bf, "rutaFoto": rf});//this.encodeImageUri(element)});
              });
            } 
            this.loadingComponent.present();        
            this.newIncService.nuevaIncidencia(this.user.token, this.newInc.tipoElementoID, this.newInc.tipoIncidenciaID, this.newInc.desAveria,
            this.newInc.lat, this.newInc.lng, this.newInc.calleID, this.newInc.nomCalle, this.newInc.numCalle, this.newInc.desUbicacion, this.newInc.edificioID, 
            this.newInc.estadoAvisoID, this.newInc.tipoProcedenciaID, this.newInc.fotos, this.newInc.desTipoElemento, this.newInc.desTipoIncidencia)
            .subscribe((inc) =>{
              this.loadingComponent.dismiss();
              if (inc[0].AvisoID != ""){
                this.presentIncidentSuccess(inc[0].AvisoID == undefined ? inc[0].AvisoCiudadanoID : inc[0].AvisoID);
              }else{
                this.showAlert(this.translate.instant("app.genericErrorAlertTitle"), this.translate.instant("newInc.presentConfirmErrorAlertMessage"), this.translate.instant("app.btnAccept"));
              }
            },
            error =>{
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
    /*let alert = Alert.create({
      title: this.translate.instant("newInc.presentIncidentSuccessAlertTitle"),
      message: 'CIU@24/2016',
      buttons: [
        {
          text: this.translate.instant("app.continueBtn"),
          role: 'cancel',
          handler: () => {
            //this.nav.push(IncidentsPage, {});
            this.nav.pop();           
            this.events.publish('tab:inc');            
          }
        },
        {
          text: this.translate.instant("survey.title"),
          handler: () => {
            this.nav.push(SurveyPage, {});
          }
        }
      ]
    });
    this.nav.present(alert);*/
    let alert = this.alertCtrl.create({
      title: this.translate.instant("newInc.presentIncidentSuccessAlertTitle"),
      message: "COD: " + avisoID,
      buttons: [
        {
          text: this.translate.instant("app.continueBtn"),
          role: 'cancel',
          handler: () => {
            this.nav.pop();           
            this.events.publish('tab:inc');            
          }
        }
      ]
    });
    alert.present();
  }

  newIncident(){
    if (this.checkFields()) this.presentConfirm();
  }
  
  checkFields(){
    var ok = true;
    
    if (this.newInc.tipoElementoID == -1){
      ok = false;
      this.showAlert(this.translate.instant("incidents.atentionAlertTitle"), this.translate.instant("newInc.elementAlertMessage"), this.translate.instant("app.btnAccept"));
      return ok;
    }
    
    if (this.newInc.tipoIncidenciaID == -1){
      ok = false;
      this.showAlert(this.translate.instant("incidents.atentionAlertTitle"), this.translate.instant("newInc.incidentAlertMessage"), this.translate.instant("app.btnAccept"));
      return ok;
    }
    
    if (this.newInc.desAveria == ""){
      ok = false;
      this.showAlert(this.translate.instant("incidents.atentionAlertTitle"), this.translate.instant("newInc.descriptionAlertMessage"), this.translate.instant("app.btnAccept"));
      return ok;
    }
    
    return ok;
  }
  
  showAlert(title, subTitle, okButton){
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: [okButton]
    });
    alert.present();
  }
  
  changeTipoElemento(){
    if(this.platform.is('ios') && useSQLiteOniOS){
      this.db.getValue('tiposIncidencias').then((tiposIncidencias) => {
          this.tiposIncidencias = JSON.parse(tiposIncidencias.toString());
          this.tiposIncidencias = this.tiposIncidencias.filter(item => item.TipoElementoID == this.newInc.tipoElementoID);
      });
    }else{
      this.storage.get('tiposIncidencias').then((tiposIncidencias) => {
          this.tiposIncidencias = JSON.parse(tiposIncidencias);
          this.tiposIncidencias = this.tiposIncidencias.filter(item => item.TipoElementoID == this.newInc.tipoElementoID)
      })
    }
  }
  
  changeTipoIncidencia(){
    this.newInc.desTipoElemento = this.tiposElementos.filter(item => item.TipoElementoID == this.newInc.tipoElementoID)[0].DesTipoElemento
    this.newInc.desTipoIncidencia = this.tiposIncidencias.filter(item => item.TipoIncID == this.newInc.tipoIncidenciaID)[0].TipoInc
  }
  
  openGallery(){
    let galleryModal = this.modalCtrl.create(GalleryModalPage, this.images);      
    //galleryModal.onDismiss(data => {
      //console.log(data);
    //});     
    galleryModal.present();  
  }

  mapClass(){
    if (this.hideMap){
      return "mapIncHidden";
    }else{
      return "mapInc";
    }
  }
  
}
