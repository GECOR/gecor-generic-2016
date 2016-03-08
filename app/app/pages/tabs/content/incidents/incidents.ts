import {NavController, NavParams, MenuController} from 'ionic-framework/ionic';
import {Page, ViewController, Platform} from 'ionic-framework/ionic';
import {forwardRef, NgZone} from 'angular2/core';
import {AndroidAttribute} from './../../../../directives/global.helpers';
import {ConferenceData} from './../../../../providers/conference-data';
import {IncDetailPage} from './incDetail/incDetail';



@Page({
  templateUrl: './build/pages/tabs/content/incidents/incidents.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class IncidentsPage {
  isAndroid: any;
  activeMenu: any;
  incidents: any[];
  constructor(private platform: Platform
    , private menu: MenuController
    , private confData: ConferenceData
    , private nav: NavController
    , private _ngZone: NgZone ) {
    this.platform = platform;
    this.isAndroid = platform.is('android');
    this.incidents = confData.data.incidents;
  }

  showMap() {
    setTimeout(() =>
        this.loadMap()
      , 100);
  }

  loadMap() {
    let mapEle = document.getElementById('map');

    let map = new google.maps.Map(mapEle, {
      center: this.incidents.find(d => d.center),
      zoom: 16
    });

    this.incidents.forEach(item => {
      let infoWindow = new google.maps.InfoWindow({
        //content: `<h5>${markerData.name}</h5>`
        content: `<ion-item>
                    <ion-thumbnail>
                      <img src="${item.img}">
                    </ion-thumbnail>
                    <h2>${item.type}</h2>
                    <span>${item.route}</span><br>
                    <span>${item.state}</span><br>
                  </ion-item>`
                  //<button primary item-right (click)="$openDetail(incident)">View</button>
      });

      let marker = new google.maps.Marker({
        position: item,
        map: map,
        title: item.name
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
    });

    google.maps.event.addListenerOnce(map, 'idle', () => {
      mapEle.classList.add('show-map');
    });
  }

  openDetail(incident) {
    this.nav.push(IncDetailPage, incident);
  }
}
