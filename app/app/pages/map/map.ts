import {Page} from 'ionic-angular';
import {ConferenceData} from '../../providers/conference-data';
import {Geolocation, Camera} from 'ionic-native';

@Page({
  templateUrl: 'build/pages/map/map.html'
})
export class MapPage {
  constructor(private confData: ConferenceData) {}

  takePhoto(){
    /*
    navigator.camera.getPicture((imageURI) => {
      var image = document.getElementById('myImage');
      image.src = imageURI;
    }, (message) => {
      alert('Failed because: ' + message);
    }, { quality: 50, destinationType: Camera.DestinationType.FILE_URI });
    */
    //console.log(Camera.getPicture());

    Geolocation.getCurrentPosition().then(pos => {
      console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
    }, err => {
      alert('Error Geocoder');
      console.log('Error Geocoder');
    });

    Camera.getPicture().then((imageURI) => {
      var image = document.getElementById('myImage');
      image.src = imageURI;
    }, (message) => {
      alert('Failed because Camera!');
      console.log('Failed because: ');
      console.log(message);
    });//, { quality: 50}

  }
}
