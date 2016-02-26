import {Page} from 'ionic-framework/ionic';
import {ConferenceData} from '../../providers/conference-data';

@Page({
  templateUrl: 'build/pages/map/map.html'
})
export class MapPage {
  constructor(private confData: ConferenceData) {}

  takePhoto(){
      navigator.camera.getPicture((imageURI) => {
        var image = document.getElementById('myImage');
        image.src = imageURI;
      }, (message) => {
        alert('Failed because: ' + message);
      }, { quality: 50, destinationType: Camera.DestinationType.FILE_URI });
  }
}
