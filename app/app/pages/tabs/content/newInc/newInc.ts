import {NavController, NavParams, MenuController, Alert, ActionSheet, Page, ViewController, Platform} from 'ionic-angular';
import {forwardRef, NgZone, provide} from 'angular2/core';
import {AndroidAttribute} from './../../../../directives/global.helpers';
import {ConferenceData} from './../../../../providers/conference-data';
import {marker} from './newIncInterface';
import {Geolocation, Camera} from 'ionic-native';
import {IncidentsPage} from './../incidents/incidents';
import {SurveyPage} from './survey/survey';
import {
  MapsAPILoader,
  NoOpMapsAPILoader,
  MouseEvent,
  ANGULAR2_GOOGLE_MAPS_PROVIDERS,
  SebmGoogleMap
} from 'angular2-google-maps/core';
import {GoogleMapsAPIWrapper} from 'angular2-google-maps/services/google-maps-api-wrapper';


@Page({
  templateUrl: './build/pages/tabs/content/newInc/newInc.html',
  directives: [forwardRef(() => AndroidAttribute), SebmGoogleMap],
  providers: [ANGULAR2_GOOGLE_MAPS_PROVIDERS, GoogleMapsAPIWrapper,  provide(MapsAPILoader, {useClass: NoOpMapsAPILoader})]
})
export class NewIncPage {
  isAndroid: any;
  activeMenu: any;
  images: any;
  //MAP
  map: any;
  latLng: any;
  geocoderService: any;
  startAddress: string;
  // google maps zoom level
  zoom: number = 8;
  // initial center position for the map
  lat: number;
  lng: number;
  markers: marker[] = []
  //END MAP
  constructor(private platform: Platform
    , private menu: MenuController
    , private confData: ConferenceData
    , private nav: NavController
    , private _ngZone: NgZone
    , private _map: GoogleMapsAPIWrapper ) {
    this.platform = platform;
    this.isAndroid = platform.is('android');
    this.images = [undefined, undefined, undefined, undefined];

    this.initGeolocation();
  }



  //MAP
  clickedMarker(label: string, index: number) {
    window.alert(`clicked the marker: ${label || index}`)
    this.markers.splice(index, 1);
  }

  mapClicked($event: MouseEvent) {
    //this.markers = [];
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true
    });
  }

  markerDragEnd(m: marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }

  initGeolocation() {
    let options = {maximumAge: 5000, timeout: 15000, enableHighAccuracy: true};
    /*navigator.geolocation*/
    Geolocation.getCurrentPosition(
      (position) => {
        this.geocoderService = new google.maps.Geocoder;

        this.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;

        this.geocoderService.geocode({'location': this.latLng}, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results[0]) {
              this.startAddress = results[0].formatted_address;
              this._ngZone.run(() => {
                this.markers.push({
                  lat: results[0].geometry.location.lat(),
                  lng: results[0].geometry.location.lng(),
                  draggable: true
                });
              });
              //_this.loadMap();
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
        });
      },
      (error) => {
        let alert = Alert.create({
        title: error.code.toString(),
        subTitle: error.message,
        buttons: [
          {
            text: 'Retry',
            role: 'reload',
            handler: () => {
              //this.loadMap();
            }
          }
          ]
        });
        this.nav.present(alert);
      }, options);
  }

  centerMap(){
    let lanlng = new google.maps.LatLng(parseFloat(this.lat), parseFloat(this.lng));
    //this._ngZone.run(() => {
      this._map.setCenter(lanlng);
      //this._map.setCenter(this.lat, this.lng);
    //});
  }

  //END MAP

  takePhoto(id){
    let actionSheet = ActionSheet.create({
      title: '',
      buttons: [
        {
          text: 'Gallery',
          handler: () => {
            window.imagePicker.getPictures((results) => {
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
            Camera.getPicture().then((imageURI) => {
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
}
