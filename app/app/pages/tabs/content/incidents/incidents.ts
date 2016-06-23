import {NavController, NavParams, MenuController, Storage, SqlStorage, Alert, Loading} from 'ionic-angular';
import {Page, ViewController, Platform} from 'ionic-angular';
import {forwardRef, NgZone} from '@angular/core';
import {AndroidAttribute} from './../../../../directives/global.helpers';
import {ConferenceData} from './../../../../providers/conference-data';
import {IncDetailPage} from './incDetail/incDetail';
import {ArraySortPipe} from './incidentsArraySort';
import {IncidentsSearchPipe} from './incidentsPipe';
import {IncidentService} from './IncidentService';
import {GeolocationProvider} from './../../../../providers/geolocation';
import {DBProvider} from './../../../../providers/db';
import {UtilsProvider} from './../../../../providers/utils';
import {ReviewPage} from './incDetail/review/review';
import {TranslatePipe, TranslateService} from 'ng2-translate/ng2-translate';
import {defaultLanguage, folderLanguage, sourceLanguage, compareLanguage, useSQLiteOniOS} from './../../../../appConfig';
//import {LazyLoadImageDirective} from 'ng2-lazyload-image';

@Page({
  templateUrl: './build/pages/tabs/content/incidents/incidents.html',
  directives: [forwardRef(() => AndroidAttribute)],
  pipes: [ArraySortPipe, IncidentsSearchPipe, TranslatePipe],
  providers: [IncidentService, GeolocationProvider, UtilsProvider, DBProvider]
})
export class IncidentsPage {
  isAndroid: any;
  activeMenu: any;
  incidents: any=[];
  type: any = 'list';
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
  entity: any;
  
  constructor(private platform: Platform
    , private menu: MenuController
    , private confData: ConferenceData
    , private nav: NavController
    , private zone: NgZone
    , private incidentService: IncidentService
    , private geo: GeolocationProvider
    , private utils: UtilsProvider 
    , private translate : TranslateService
    , private db: DBProvider) {
      
    this.platform = platform;
    this.isAndroid = platform.is('android');
    //this.type = 'list';
    this.order = 'FechaHoraRegistro';
    this.searchText = '';
    this.map = null;
    
    this.loadingComponent = utils.getLoading(this.translate.instant("app.loadingMessage"));
  }
  
  ionViewWillEnter() {

    if(this.platform.is('ios') && useSQLiteOniOS){
      this.db.getValue('user').then((user) => {
          this.user = JSON.parse(user.toString());
          this.nav.present(this.loadingComponent);
          this.getMisIncidencias(this.user.CiudadanoID, this.user.token);
      });
      this.db.getValue('entity').then((entity) => {
          this.entity = JSON.parse(entity.toString());
          this.latLng = new google.maps.LatLng(this.entity.Latitud, this.entity.Longitud);

          this.geo.getLocation().then(location =>{
            this.location = location;
            if (this.location.error){
              this.latLng = new google.maps.LatLng(this.entity.Latitud, this.entity.Longitud);
            }else{
              this.latLng = this.location.latLng;
            }      
          });
      });
    }else{
      this.storage = new Storage(SqlStorage);
      
      this.storage.get('user').then((user) => {
          this.user = JSON.parse(user);
          this.nav.present(this.loadingComponent);
          this.getMisIncidencias(this.user.CiudadanoID, this.user.token);
      });
      this.storage.get('entity').then((entity) => {
          this.entity = JSON.parse(entity);
          this.latLng = new google.maps.LatLng(this.entity.Latitud, this.entity.Longitud);

          this.geo.getLocation().then(location =>{
            this.location = location;
            if (this.location.error){
              this.latLng = new google.maps.LatLng(this.entity.Latitud, this.entity.Longitud);
            }else{
              this.latLng = this.location.latLng;
            }      
          });
      });
    }

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
  
  openReview(incident, slidingItem) {
    slidingItem.close();
    this.nav.push(ReviewPage, incident);
  }
  
  classIncident(incident) {
    switch (incident.EstadoAvisoID) {
      case 12:
        var result = "incident-state-12";
        break;
        
      case 9:
      var result = "incident-state-9";
      break;
      
      case 11:
      var result = "incident-state-11";
      break;
      
      case 13:
      var result = "incident-state-13";
      break;
    
      default:
        break;
    }
    return result;
  }

  distance(incident) {
    if(!this.latLng){
      return "Calculating distance..."
    }else{
      return this.utils.roundTwoDecimals(this.utils.getDistanceFromLatLonInKm(incident["Lat"], incident["Lng"], this.latLng.lat(), this.latLng.lng())) + " km";
    }
  }

  sizeByteOfImage(url){
    this.utils.getContentLengthFromUrl(url)
            .subscribe((res) =>{
              console.log(res);
            },
            error =>{
              this.errorMessage = <any>error;
            });
  }
}
