import {NavController, NavParams, MenuController, Storage, SqlStorage, Alert, Loading} from 'ionic-angular';
import {Page, ViewController, Platform} from 'ionic-angular';
import {forwardRef, NgZone} from '@angular/core';
import {AndroidAttribute} from './../../../../directives/global.helpers';
import {ConferenceData} from './../../../../providers/conference-data';
import {IncDetailPage} from './incDetail/incDetail';
import {ArraySortPipe} from './../../../../pipes/arraySort';
import {IncidentsSearchPipe} from './incidentsPipe';
import {IncidentService} from './IncidentService';
import {GeolocationProvider} from './../../../../providers/geolocation';

@Page({
  templateUrl: './build/pages/tabs/content/incidents/incidents.html',
  directives: [forwardRef(() => AndroidAttribute)],
  pipes: [ArraySortPipe, IncidentsSearchPipe],
  providers: [IncidentService, GeolocationProvider]
})
export class IncidentsPage {
  isAndroid: any;
  activeMenu: any;
  incidents: any=[];
  type: any;
  order: any;
  searchText: any;
  errorMessage: any;
  user: any = {};
  storage: any;
  location: any;
  latLng: any;
  map: any;
  distanceTravel: string;
  directionsService: any;
  geocoderService: any;
  directionsDisplay: any;
  stepDisplay: any;
  startAddress: string;
  endAddress: string;
  markerArray: any[];
  timeTravel: string;
  loadingComponent: any;
  
  constructor(private platform: Platform
    , private menu: MenuController
    , private confData: ConferenceData
    , private nav: NavController
    , private zone: NgZone
    , private incidentService: IncidentService
    , private geo: GeolocationProvider ) {
      
    this.platform = platform;
    this.isAndroid = platform.is('android');
    this.type = 'list';
    this.order = 'FechaHoraRegistro';
    this.searchText = '';
    this.storage = new Storage(SqlStorage);
    this.map = null;
    
    this.loadingComponent = Loading.create({
                content: 'Please wait...'
            });
    
  }
  
  onPageWillEnter() {
    this.storage.get('user').then((user) => {
        this.user = JSON.parse(user);
        this.nav.present(this.loadingComponent);
        this.getMisIncidencias(this.user.CiudadanoID, this.user.token);
    })
    
    this.geo.getLocation().then(location =>{
      this.location = location;
      this.latLng = this.location.latLng;
    });    
  }

  showMap() {
    setTimeout(() =>
        this.loadMap()
      , 100);
  }
  
  //MAP
  loadMap() {//ngAfterViewInit
    this.directionsService = new google.maps.DirectionsService();
    let mapOptions = {
        center: this.latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(document.getElementById("mapDetail"), mapOptions);    
    this.addMarkers();
  }
  
  addMarkers() {
    var infowindow, contentString;
    for (let i = 0; i < this.incidents.length; i++) {
      let marker = new google.maps.Marker;
      marker.setMap(this.map);
      let location = new google.maps.LatLng(this.incidents[i].Lat, this.incidents[i].Lng)
      marker.setPosition(location);
        
      contentString = '<div id="content">'+
      '<div id="siteNotice"></div>'+
      '<img src="'+this.incidents[i].RutaFoto+'" alt="Foto" height="60" width="60">'+
      '<h1 id="firstHeading" class="firstHeading">'+this.incidents[i].TipoInc+'</h1>'+
      '<div id="bodyContent">'+
      '<p>'+this.incidents[i].DesUbicacion+'</p>'+
      '</div>'+
      '</div>';
      
      infowindow = new google.maps.InfoWindow({
        content: contentString
      });
      
      marker.addListener('click', function() {
        infowindow.open(this.map, marker);
      });
    }
  }

  //END MAP

  openDetail(incident) {
    this.nav.push(IncDetailPage, incident);
  }

  inputSearch(search) {
    console.log(search.value);
  }
  
  getMisIncidencias(ciudadanoID, token) {
        this.incidentService.getMisIncidencias(ciudadanoID, token)
                            .subscribe(
                                (result) =>{
                                  this.loadingComponent.dismiss();
                                  this.incidents = result;                                                                   
                                },
                                error =>{
                                  this.errorMessage = <any>error;
                                  this.loadingComponent.dismiss();
                                });
    }
}
