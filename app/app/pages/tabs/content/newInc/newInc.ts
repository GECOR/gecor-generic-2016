import {NavController, NavParams, MenuController, Alert, ActionSheet, Page, ViewController, Platform, Storage, SqlStorage} from 'ionic-angular';
import {forwardRef, NgZone, provide} from '@angular/core';
import {AndroidAttribute} from './../../../../directives/global.helpers';
import {ConferenceData} from './../../../../providers/conference-data';
import {marker} from './newIncInterface';
import {Geolocation, Camera, ImagePicker} from 'ionic-native';
import {IncidentsPage} from './../incidents/incidents';
import {SurveyPage} from './survey/survey';
import {GeolocationProvider} from './../../../../providers/geolocation';

@Page({
  templateUrl: './build/pages/tabs/content/newInc/newInc.html',
  directives: [forwardRef(() => AndroidAttribute)],
  providers: [GeolocationProvider]
})
export class NewIncPage {
  isAndroid: any;
  activeMenu: any;
  images: any;
  familia: any;
  tiposElementos: any;
  tiposIncidencias: any;
  storage: any;
  newInc: any = {};
  
  //MAP
  map: google.maps.Map;
  marker: google.maps.Marker;
  latLng: any;
  location: any;
  geocoderService: any;
  startAddress: string;
  // google maps zoom level
  zoom: number = 12;
  // initial center position for the map
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
    ) {
    this.platform = platform;
    this.isAndroid = platform.is('android');
    this.images = [undefined, undefined, undefined, undefined];
    this.familia = params.data;
    this.storage = new Storage(SqlStorage);
    
    this.storage.get('tiposElementos').then((tiposElementos) => {
        this.tiposElementos = JSON.parse(tiposElementos);
        this.tiposElementos = this.tiposElementos.filter(item => item.FamiliaTipoElementoID == this.familia.FamiliasTiposElementosID)
    })
    
    this.geo.getLocation().then(location =>{
      this.location = location;
      this.latLng = this.location.latLng;
      this.startAddress = this.location.startAddress;
      setTimeout(() =>
          this.initMap()
        , 100);      
    });    
  }

  //MAP  
  initMap() {
    let mapEle = document.getElementById('mapInc');

      this.map = new google.maps.Map(mapEle, {
        center: this.latLng,
        zoom: this.zoom
      });             
       
      //let infoWindow = new google.maps.InfoWindow({
        //content: `<h5>${this.startAddress}</h5>`
      //});

      this.marker = new google.maps.Marker({
        position: this.latLng,
        map: this.map,
        title: this.startAddress,
        draggable: true
      });      
      
      this.map.addListener('click', (e) => {                 
        this.geo.getDirection(e.latLng).then(location =>{
          this.location = location;
          this.marker.setPosition(this.location.latLng);
          this.marker.setTitle(this.location.startAddress);
          //infoWindow.setContent(`<h5>${resp.startAddress}</h5>`)
          this.startAddress = this.location.startAddress;          
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
          this.startAddress = this.location.startAddress;          
        })          
      });
      
      google.maps.event.addListenerOnce(this.map, 'idle', () => {
        mapEle.classList.add('show-map');
      });
  }
  
  centerMap(){
    this.geo.getLocation().then(location =>{
      this.location = location;
      this.latLng = this.location.latLng;
      this.startAddress = this.location.startAddress;
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
                    for (var i = 0; i < results.length; i++) {
                        console.log('Image URI: ' + results[i]);
                    }
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
            Camera.getPicture({quality: 50}).then((imageURI) => {
              this.images[id] = imageURI;
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
      title: 'Confirm incident',
      message: 'Calzada - Rota <br> En calle Marie Curie, 5 <br> Fotos: 2',
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
            this.presentIncidentSuccess();
          }
        }
      ]
    });
    this.nav.present(alert);
  }

  presentIncidentSuccess() {
    let alert = Alert.create({
      title: 'Incident sent',
      message: 'CIU@24/2016',
      buttons: [
        {
          text: 'Continue',
          role: 'cancel',
          handler: () => {
            this.nav.push(IncidentsPage, {});
          }
        },
        {
          text: 'Survey',
          handler: () => {
            this.nav.push(SurveyPage, {});
          }
        }
      ]
    });
    this.nav.present(alert);
  }

  newIncident(){
    this.presentConfirm();
  }
  
  changeTipoElemento(){
    this.newInc.tipoIncidenciaID = undefined;
    this.storage.get('tiposIncidencias').then((tiposIncidencias) => {
        this.tiposIncidencias = JSON.parse(tiposIncidencias);
        this.tiposIncidencias = this.tiposIncidencias.filter(item => item.TipoElementoID == this.newInc.tipoElementoID)
    })
  }
}
