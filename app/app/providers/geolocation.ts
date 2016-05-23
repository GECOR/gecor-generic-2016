import {Injectable} from '@angular/core';
import {Geolocation} from 'ionic-native';


@Injectable()
export class GeolocationProvider {
  location: any = {};
  //MAP
  map: any;
  latLng: any;
  geocoderService: any;
  startAddress: string;
  // google maps zoom level
  // initial center position for the map
  lat: number;
  lng: number;
  //END MAP

  constructor() {}

  locate() {
    let options = {maximumAge: 5000, timeout: 15000, enableHighAccuracy: true};
    /*navigator.geolocation*/
    return new Promise(resolve => {        
        Geolocation.getCurrentPosition(options).then(position => { 
          this.geocoderService = new google.maps.Geocoder;

          this.location.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          this.location.lat = position.coords.latitude;
          this.location.lng = position.coords.longitude;

          this.geocoderService.geocode({'location': this.location.latLng}, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
              if (results[0]) {
                this.location.startAddress = results[0].formatted_address;
                    resolve(this.location);
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
            resolve({'error': error});
            }
        );
    });
  }

  getLocation() {
    return this.locate().then(location => {
      return location;
    });
  }
  
  getDirection(latLng) {
    return new Promise(resolve => {        
        if(this.geocoderService == undefined || this.geocoderService == null)
        this.geocoderService = new google.maps.Geocoder;
        
        this.geocoderService.geocode({'location': latLng}, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                this.location.latLng = results[0].geometry.location;
                this.location.lat = results[0].geometry.location.lat();
                this.location.lng = results[0].geometry.location.lng();
                this.location.startAddress = results[0].formatted_address;
                resolve(this.location);                    
            } else {                    
                resolve({'error': 'No results found'});
            }
            } else {                    
                resolve({'error': 'Geocoder failed due to: ' + status});
            }
        });            
    });
  }
  
}
