import {Component, forwardRef, NgZone, Provider} from '@angular/core';
import {NavController, NavParams, MenuController, AlertController, ActionSheetController, ViewController, 
        Platform, Events, ModalController} from 'ionic-angular';
import {AndroidAttribute} from './../../../../../../directives/global.helpers';
import {ConferenceData} from './../../../../../../providers/conference-data';
import {marker} from './reviewInterface';
import {Geolocation, Camera, ImagePicker} from 'ionic-native';
import {GeolocationProvider} from './../../../../../../providers/geolocation';
import {DBProvider} from './../../../../../../providers/db';
import {ReviewService} from './reviewService';
import {GalleryModalPage} from './../../../../../galleryModal/galleryModal';
import {TranslatePipe, TranslateService} from 'ng2-translate/ng2-translate';
import {UtilsProvider} from './../../../../../../providers/utils';
import {defaultLanguage, folderLanguage, sourceLanguage, compareLanguage, useSQLiteOniOS} from './../../../../../../app/appConfig';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'review-page',
  templateUrl: 'review.html',
  //directives: [forwardRef(() => AndroidAttribute)],
  providers: [GeolocationProvider, ReviewService, UtilsProvider],
        //pipes: [TranslatePipe]
})
export class ReviewPage {
  showTypology: boolean;
  showMap: boolean;
  images: any;
  uploadingImages: any;
  estados:any;
  responsables: any;
  tiposElementos: any;
  tiposIncidencias: any;
  //storage: any;
  errorMessage: any;
  user: any = {};
  reviewInc: any;
  private reviewIncBackup: any;
  loadingComponent: any;
  base64string = "data:image/jpeg;base64,";
  incReviewd: boolean = false;
  
  //MAP
  map: google.maps.Map;
  marker: google.maps.Marker;
  latLng: any;
  location: any;
  geocoderService: any;
  startAddress: string;
  zoom: number = 12;
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
    , private reviewService: ReviewService
    , private utils: UtilsProvider
    , private translate : TranslateService
    , private events: Events
    , private db: DBProvider
    , public modalCtrl: ModalController
    , public alertCtrl: AlertController
    , public actionSheetCtrl: ActionSheetController
    , public storage: Storage) 
  {
    this.showTypology = false;
    this.showMap = false;
    this.images = ["", "", "", ""];
    this.uploadingImages = [false, false, false, false];    
    this.reviewInc = params.data;
    this.reviewIncBackup = Object.assign({}, this.reviewInc);
    this.reviewInc.fotos = [];
    
    this.loadingComponent = utils.getLoading(this.translate.instant("app.loadingMessage"));
    
    if(platform.is('ios') && useSQLiteOniOS){
       db.getValue('tiposElementos').then((tiposElementos) => {
        this.tiposElementos = JSON.parse(tiposElementos.toString());
      });
      db.getValue('estados').then((estados) => {
          this.estados = JSON.parse(estados.toString());
      });
      db.getValue('responsables').then((responsables) => {
          this.responsables = JSON.parse(responsables.toString());
      });
      db.getValue('user').then((user) => {
          this.user = JSON.parse(user.toString());
      });
    }else{
      //this.storage = new Storage(SqlStorage);    
      this.storage.get('tiposElementos').then((tiposElementos) => {
          this.tiposElementos = JSON.parse(tiposElementos);
      });
      this.storage.get('estados').then((estados) => {
          this.estados = JSON.parse(estados);
      });
      this.storage.get('responsables').then((responsables) => {
          this.responsables = JSON.parse(responsables);
      });
      this.storage.get('user').then((user) => {
          this.user = JSON.parse(user);
      });
    }

    if (this.showMap){
      this.geo.getLocation().then(location =>{
        this.location = location;
        this.latLng = this.location.latLng;
        this.reviewInc.lat = this.latLng.lat();
        this.reviewInc.lng = this.latLng.lng();
        this.reviewInc.desUbicacion = this.location.startAddress;
        setTimeout(() =>
            this.initMap()
          , 100);      
      });    
    }
  }

  ionViewWillLeave(){
    if (!this.incReviewd){
      this.reviewInc.EstadoAvisoID = this.reviewIncBackup.EstadoAvisoID;
      this.reviewInc.DesEstadoAviso = this.reviewIncBackup.DesEstadoAviso;
      this.reviewInc.Responsable = this.reviewIncBackup.Responsable;
      this.reviewInc.OrigenIDResponsable = this.reviewIncBackup.OrigenIDResponsable;
    }
  }

  //MAP  
  initMap() {
    let mapEle = document.getElementById('mapInc');

      this.map = new google.maps.Map(mapEle, {
        center: this.latLng,
        zoom: this.zoom
      });        
      this.marker = new google.maps.Marker({
        position: this.latLng,
        map: this.map,
        title: this.reviewInc.desUbicacion,
        draggable: true
      });      
      
      this.map.addListener('click', (e) => {                 
        this.geo.getDirection(e.latLng).then(location =>{
          this.location = location;
          this.latLng = this.location.latLng;
          this.reviewInc.lat = this.latLng.lat();
          this.reviewInc.lng = this.latLng.lng();
          this.marker.setPosition(this.location.latLng);
          this.marker.setTitle(this.location.startAddress);
          //infoWindow.setContent(`<h5>${resp.startAddress}</h5>`)
          this.reviewInc.desUbicacion = this.location.startAddress;          
        })               
      });
      
      this.marker.addListener('click', () => {
       //infoWindow.open(map, marker);
      });
      
      this.marker.addListener('dragend', (e) => {       
       this.geo.getDirection(e.latLng).then(resp =>{
          this.marker.setPosition(this.location.latLng);
          this.marker.setTitle(this.location.startAddress);
          //infoWindow.setContent(`<h5>${resp.startAddress}</h5>`)
          this.reviewInc.desUbicacion = this.location.startAddress;          
        })          
      });
      
      google.maps.event.addListenerOnce(this.map, 'idle', () => {
        mapEle.classList.add('show-map');
      });
  }
  
  centerMap(){
    this.geo.getLocation().then(location => {
      this.location = location;
      this.latLng = this.location.latLng;
      this.reviewInc.lat = this.latLng.lat();
      this.reviewInc.lng = this.latLng.lng();
      this.reviewInc.desUbicacion = this.location.startAddress;
      this.map.setCenter(this.latLng);
      this.marker.setPosition(this.location.latLng);
      this.marker.setTitle(this.location.startAddress); 
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
  
  uploadImage(imgBase64, id){
    if (imgBase64 != ""){
      this.reviewService.guardarFotoBase64(this.user.token, imgBase64)
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
      title: this.translate.instant("incidents.review.presentConfirmAlertTitle"),
      message: this.reviewInc.desSolucion,
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
                this.reviewInc.fotos.push({"byteFoto": bf, "rutaFoto": rf});//this.encodeImageUri(element)});
              });
            }    
            this.loadingComponent.present();
            this.loadingComponent.onDidDismiss((result) => {

              if (result[0].RowsAffected > 0){
                let navTransition = alert.dismiss();
                navTransition.then(() => { 
                  this.presentReviewIncidentSuccess()
                });
                //this.presentReviewIncidentSuccess();
              }else{
                this.showAlert(this.translate.instant("app.genericErrorAlertTitle"), this.translate.instant("incidents.review.presentConfirmAlertMessage"), this.translate.instant("app.btnAccept"));
              }
            });
            
            this.reviewService.revisarIncidencia(this.user.token, this.reviewInc.AvisoID, this.reviewInc.DesSolucion, this.reviewInc.EstadoAvisoID, this.reviewInc.OrigenIDResponsable,
            this.reviewInc.fotos)
            .subscribe((result) =>{
              this.loadingComponent.dismiss(result);              
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

  presentReviewIncidentSuccess() {
    let alertSuccess = this.alertCtrl.create({
      title: this.translate.instant("incidents.review.presentReviewAlertTitle"),
      message: this.translate.instant("incidents.review.presentReviewAlertMessage"),
      buttons: [
        {
          text: this.translate.instant("app.continueBtn"),
          role: 'cancel',
          handler: () => {
            //alertSuccess.dismiss(); 
            this.incReviewd = true;
            let navTransition = alertSuccess.dismiss();
            navTransition.then(() => { 
              setTimeout(() => this.nav.pop(), 200);
            });         
          }
        }
      ]
    });
    
    alertSuccess.present();
  }

  reviewIncident(){
    if (this.checkFields()) this.presentConfirm();
  }
  
  checkFields(){
    var ok = true;
    
    if (this.reviewInc.DesSolucion == ""){
      ok = false;
      //this.showAlert(this.translate.instant("incidents.atentionAlertTitle"), this.translate.instant("incidents.review.checkFieldsAlertMessage"), this.translate.instant("app.btnAccept"));
      let alert = this.alertCtrl.create({
        title: this.translate.instant("incidents.atentionAlertTitle"),
        subTitle: this.translate.instant("incidents.review.checkFieldsAlertMessage"),
        buttons: [this.translate.instant("app.btnAccept")]
      });
      alert.present();
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
          this.tiposIncidencias = this.tiposIncidencias.filter(item => item.TipoElementoID == this.reviewInc.tipoElementoID)
      });
    }else{
      this.storage.get('tiposIncidencias').then((tiposIncidencias) => {
          this.tiposIncidencias = JSON.parse(tiposIncidencias);
          this.tiposIncidencias = this.tiposIncidencias.filter(item => item.TipoElementoID == this.reviewInc.tipoElementoID)
      })
    }
  }
  
  changeTipoIncidencia(){
    this.reviewInc.desTipoElemento = this.tiposElementos.filter(item => item.TipoElementoID == this.reviewInc.tipoElementoID)[0].DesTipoElemento
    this.reviewInc.desTipoIncidencia = this.tiposIncidencias.filter(item => item.TipoIncID == this.reviewInc.tipoIncidenciaID)[0].TipoInc
  }

  changeResponsable(){
    this.reviewInc.Responsable = this.responsables.filter(item => item.OrigenID == this.reviewInc.OrigenIDResponsable)[0].DesOrigen
  }

  changeEstado(){
    this.reviewInc.DesEstadoAviso = this.estados.filter(item => item.EstadoAvisoID == this.reviewInc.EstadoAvisoID)[0].Nombre
  }
  
   openGallery(){
    let galleryModal = this.modalCtrl.create(GalleryModalPage, this.images);      
    //galleryModal.onDismiss(data => {
      //console.log(data);
    //});     
    galleryModal.present();  
  }
  
}

