import {NavController, NavParams, MenuController, Alert, ActionSheet, Page, ViewController, 
        Platform, Storage, SqlStorage, Events, Loading} from 'ionic-angular';
import {forwardRef, NgZone, provide} from '@angular/core';
import {AndroidAttribute} from './../../../../../../directives/global.helpers';
import {ConferenceData} from './../../../../../../providers/conference-data';
import {marker} from './reviewInterface';
import {Geolocation, Camera, ImagePicker} from 'ionic-native';
import {GeolocationProvider} from './../../../../../../providers/geolocation';
import {ReviewService} from './reviewService';

@Page({
  templateUrl: './build/pages/tabs/content/incidents/incDetail/review/review.html',
  directives: [forwardRef(() => AndroidAttribute)],
  providers: [GeolocationProvider, ReviewService]
})
export class ReviewPage {
  showTypology: boolean;
  showMap: boolean;
  
  images: any;
  estados:any;
  responsables: any;
  tiposElementos: any;
  tiposIncidencias: any;
  storage: any;
  errorMessage: any;
  user: any;
  reviewInc: any;
  loadingComponent: any;
  base64string = "data:image/jpeg;base64,";
  
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
    , private events: Events
    ) 
  {
    this.showTypology = false;
    this.showMap = false;
    this.images = [undefined, undefined, undefined, undefined];
    this.reviewInc = params.data;
    this.reviewInc.fotos = [];
    this.loadingComponent = Loading.create({
                content: 'Please wait...'
            });
    
    this.storage = new Storage(SqlStorage);    
    this.storage.get('tiposElementos').then((tiposElementos) => {
        this.tiposElementos = JSON.parse(tiposElementos);
        //this.tiposElementos = this.tiposElementos.filter(item => item.FamiliaTipoElementoID == this.familia.FamiliasTiposElementosID);
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
    let actionSheet = ActionSheet.create({
      title: '',
      buttons: [
        {
          text: 'Gallery',
          handler: () => {
           ImagePicker.getPictures({maximumImagesCount: 1}).then((results) => {     
                    console.log('Image URI: ' + results[0]);             
                    this._ngZone.run(() => {
                      this.images[id] = results[0];
                    });
                }, (error) => {
                    console.log('Error: ' + error);
                }
            );
          }
        },
        {
          text: 'Camera',
          handler: () => {            
            Camera.getPicture({quality: 50, destinationType: Camera.DestinationType.DATA_URL}).then((imageURI) => {//, destinationType: Camera.DestinationType.DATA_URL
              this.images[id] = this.base64string + imageURI;
            }, (message) => {
              alert('Failed because Camera!');
              console.log('Failed because: ');
              console.log(message);
            });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log("Cancel clicked");
          }
        }
      ]
    });
    this.nav.present(actionSheet);
  }

  presentConfirm() {
    let alert = Alert.create({
      title: 'Confirm review',
      message: this.reviewInc.desSolucion,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Send',
          handler: () => {
            if(this.images){
              this.images.forEach(element => {
                this.reviewInc.fotos.push({"byteFoto": element});//this.encodeImageUri(element)});
              });
            }
            this.nav.present(this.loadingComponent);
            let navTransition = alert.dismiss();
            this.reviewService.revisarIncidencia(this.user.token, this.reviewInc.AvisoID, this.reviewInc.DesSolucion, this.reviewInc.EstadoAvisoID, this.reviewInc.OrigenIDResponsable,
            this.reviewInc.fotos)
            .subscribe((result) =>{
              this.loadingComponent.dismiss();
              //alert.dismiss();
              if (result[0].RowsAffected > 0){
                navTransition.then(() => { 
                  this.presentReviewIncidentSuccess()
                });
                //this.presentReviewIncidentSuccess();
              }else{
                this.showAlert("Error", "There is some error reviewing this incident", "OK");
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
    this.nav.present(alert);
  }

  presentReviewIncidentSuccess() {
    let alertSuccess = Alert.create({
      title: 'Incident reviewed',
      message: '',
      buttons: [
        {
          text: 'Continue',
          role: 'cancel',
          handler: () => {            
            setTimeout(() => this.nav.pop(), 200);              
          }
        }
      ]
    });
    this.nav.present(alertSuccess);
  }

  reviewIncident(){
    if (this.checkFields()) this.presentConfirm();
  }
  
  checkFields(){
    var ok = true;
    
    if (this.reviewInc.desSolucion == ""){
      ok = false;
      this.showAlert("Atention", "Please write a solution", "OK");
      return ok;
    }
    
    return ok;
  }
  
  showAlert(title, subTitle, okButton){
    let alert = Alert.create({
      title: title,
      subTitle: subTitle,
      buttons: [okButton]
    });
    this.nav.present(alert);
  }
  
  changeTipoElemento(){
    this.storage.get('tiposIncidencias').then((tiposIncidencias) => {
        this.tiposIncidencias = JSON.parse(tiposIncidencias);
        this.tiposIncidencias = this.tiposIncidencias.filter(item => item.TipoElementoID == this.reviewInc.tipoElementoID)
    })
  }
  
  changeTipoIncidencia(){
    this.reviewInc.desTipoElemento = this.tiposElementos.filter(item => item.TipoElementoID == this.reviewInc.tipoElementoID)[0].DesTipoElemento
    this.reviewInc.desTipoIncidencia = this.tiposIncidencias.filter(item => item.TipoIncID == this.reviewInc.tipoIncidenciaID)[0].TipoInc
  }
}

