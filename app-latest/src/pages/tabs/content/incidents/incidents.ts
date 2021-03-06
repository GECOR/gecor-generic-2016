import {NavController, MenuController, AlertController, Events, Platform} from 'ionic-angular';
import {NgZone, Component} from '@angular/core';
import { FormControl } from '@angular/forms';
import {ConferenceData} from './../../../../providers/conference-data';
import {IncDetailPage} from './incDetail/incDetail';
import {IncidentsSort} from './incidentsArraySort';
import {IncidentService} from './IncidentService';
import {GeolocationProvider} from './../../../../providers/geolocation';
import {DBProvider} from './../../../../providers/db';
import {UtilsProvider} from './../../../../providers/utils';
import {ReviewPage} from './incDetail/review/review';
import {TranslateService} from 'ng2-translate/ng2-translate';
import {useSQLiteOniOS} from './../../../../app/appConfig';
import {GoogleMap, GoogleMapsEvent, GoogleMapsMarker, GoogleMapsMarkerOptions, GoogleMapsLatLng} from 'ionic-native';
import {Storage} from '@ionic/storage';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'incidents-page',
  templateUrl: 'incidents.html',
  providers: [IncidentService, GeolocationProvider, UtilsProvider, DBProvider]
})
export class IncidentsPage {
  isAndroid: any;
  activeMenu: any;
  incidents: any=[]; //Este array contiene las incidencias que se ven en pantalla
  incidentsOriginal: any=[]; //Este es el array original devuelto por el servidor, se utiliza para aplicar los filtros
  type: any = 'list';
  order: any;

  searchText: any;
  searchControl: FormControl;

  errorMessage: any;
  user: any = {};
  //storage: any;
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
  incFromPush: any;
  incFromPushPending: boolean = false;
  searching: boolean = false

  exitOnBack: boolean = true;
  
  constructor(private platform: Platform
    , private menu: MenuController
    , private confData: ConferenceData
    , private nav: NavController
    , private zone: NgZone
    , private incidentService: IncidentService
    , private geo: GeolocationProvider
    , private utils: UtilsProvider 
    , private translate : TranslateService
    , private db: DBProvider
    , private events: Events
    , public alertCtrl: AlertController
    , public storage: Storage
    , public incidentsSort: IncidentsSort) {

      platform.registerBackButtonAction((event) => {
          if (this.exitOnBack){
              this.platform.exitApp();
          }
      }, 100);
      
      this.platform = platform;
      this.isAndroid = platform.is('android');
      //this.type = 'list';
      this.order = 'FechaHoraRegistro';
      this.searchText = '';
      this.searchControl = new FormControl;
      this.map = null;

      //this.storage = new Storage(SqlStorage);
      
      this.loadingComponent = utils.getLoading(this.translate.instant("app.loadingMessage"));

      this.events.subscribe('newPush', () => {
        if (this.incidents.length > 0){
          this.openDetailFromPush();
        }else{
          this.incFromPushPending = true;
        }
      });

      
    
  }

  ionViewDidLoad() {

      this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
          this.incidents = this.filterIncidents(this.incidentsOriginal);
          this.searching = false;
      });


  }

  showAlert(title, subTitle, okButton){
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: [okButton]
    });
    alert.present();
  }

  filterIncidents(array){
 
    if (this.searchText.toLowerCase() != '') {
      return array.filter((item)=>
          item.DesTipoElemento.toLowerCase().indexOf(this.searchText.toLowerCase()) != -1
          || item.TipoInc.toLowerCase().indexOf(this.searchText.toLowerCase()) != -1
          || item.DesUbicacion.toLowerCase().indexOf(this.searchText.toLowerCase()) != -1
          || item.CodAviso.toLowerCase().indexOf(this.searchText.toLowerCase()) != -1
          || item.DesEstadoAviso.toLowerCase().indexOf(this.searchText.toLowerCase()) != -1
          || item.Responsable.toLowerCase().indexOf(this.searchText.toLowerCase()) != -1
      );
    }
      return array;
  }

  ionViewWillLeave() {
    this.exitOnBack = false;
  }
  
  ionViewWillEnter() {   

    this.exitOnBack = true;

    if(this.platform.is('ios') && useSQLiteOniOS){
      this.db.getValue('user').then((user) => {
          this.user = JSON.parse(user.toString());
          if (this.incidents.length == 0){
            this.loadingComponent.present();
            this.getMisIncidencias(this.user.CiudadanoID, this.user.token, undefined);
          }
      });
      this.db.getValue('entity').then((entity) => {
          this.entity = JSON.parse(entity.toString());
          //this.latLng = new google.maps.LatLng(this.entity.Latitud, this.entity.Longitud);
          this.latLng = new GoogleMapsLatLng(this.entity.Latitud, this.entity.Longitud);

          this.geo.getLocation().then(location =>{
            this.location = location;
            if (this.location.error){
              //this.latLng = new google.maps.LatLng(this.entity.Latitud, this.entity.Longitud);
              this.latLng = new GoogleMapsLatLng(this.entity.Latitud, this.entity.Longitud);
            }else{
              this.latLng = this.location.latLng;
            }      
          });
      });
    }else{
      
      this.storage.get('user').then((user) => {
          this.user = JSON.parse(user);
          if (this.incidents.length == 0){
            this.loadingComponent.present();
            this.getMisIncidencias(this.user.CiudadanoID, this.user.token, undefined);
          }/*else{
            this.storage.get('incFromPush').then((resp) => {
              if (resp != "" && resp != undefined){
                resp = JSON.parse(resp);
                var index = this.incidents.findIndex(item => item.AvisoID == resp.id);
                if(index != undefined) this.incidents[index].TimeUpdated = resp.time;
                this.storage.set('incFromPush', '');
              }
            });
          }*/
      });
      this.storage.get('entity').then((entity) => {
          this.entity = JSON.parse(entity);
          //this.latLng = new google.maps.LatLng(this.entity.Latitud, this.entity.Longitud);
          this.latLng = new GoogleMapsLatLng(this.entity.Latitud, this.entity.Longitud);

          this.geo.getLocation().then(location =>{
            this.location = location;
            if (this.location.error){
              //this.latLng = new google.maps.LatLng(this.entity.Latitud, this.entity.Longitud);
              this.latLng = new GoogleMapsLatLng(this.entity.Latitud, this.entity.Longitud);
            }else{
              this.latLng = this.location.latLng;
            }      
          });
      });
    } 

    if(this.type == 'map') this.showMap();

  }

  showMap() {
    setTimeout(() =>
        this.loadMap()
      , 100);
  }
  
  //MAP
  loadMap() {//ngAfterViewInit
    //this.directionsService = new google.maps.DirectionsService();
    /*let mapOptions = {
        center: this.latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(document.getElementById("mapDetail"), mapOptions);    
    this.addMarkers();*/

    let mapEle = document.getElementById('mapDetail');
    let map = new GoogleMap(mapEle);

    map.one(GoogleMapsEvent.MAP_READY).then(() => {
      map.setZoom(15);
      map.setCenter(this.latLng);
      this.addMarkers(map);
    });
  }
  
  addMarkers(map) {
    for (let i = 0; i < this.incidents.length; i++) {
      let color = "";
      if (this.user.Aplicacion == 'G'){
        color = this.incidents[i].ColorTecnico;
      }else{
        color = this.incidents[i].ColorCiudadano;
      }

      
      this.addMarkerWithCustomInfoWindow(map, color, this.incidents[i]);
    }
  }

  addMarkerWithCustomInfoWindow(map: GoogleMap, color: string, incident){
    var canvas = document.createElement('canvas');
    canvas.width = 220;
    canvas.height = 120;
    var context = canvas.getContext('2d');

    var img = new Image();
    img.src = incident.RutaFoto;
    img.onload = () => {
      context.drawImage(img, 0, 5, 100, 100);

      context.font = '10pt Calibri';
      //context.fillStyle = 'blue';
      context.fillText(incident.CodAviso, 110, 15, 110);
      context.fillText(incident.TipoInc, 110, 45, 110);
      context.fillText(incident.DesTipoElemento, 110, 65, 110);

      let latLng = new GoogleMapsLatLng(incident.Lat, incident.Lng);

      let markerOptions: GoogleMapsMarkerOptions = {
        position: latLng,
        title: canvas.toDataURL(),
        draggable: false,
        icon: color,
        snippet: incident.DesUbicacion
      };

      
      map.addMarker(markerOptions)
      .then((marker: GoogleMapsMarker) => {
        marker.addEventListener(GoogleMapsEvent.MARKER_CLICK).subscribe((marker) =>{
          marker.getPosition((latLng) =>{
            latLng.lat = latLng.lat + 0.001;
            map.setCenter(latLng);
          });                   
        },
        error => {
            console.log(error);                            
        });

        marker.addEventListener(GoogleMapsEvent.INFO_CLICK).subscribe((marker) =>{
          this.openDetail(incident);                  
        },
        error => {
            console.log(error);                            
        });
      });
    };
  }

  //END MAP

  openDetail(incident) {
    this.nav.push(IncDetailPage, incident);
  }

  openDetailFromPush(){
    this.storage.get('incFromPush').then((resp) => {
        if (resp != "" && resp != undefined){
          resp = JSON.parse(resp);
          var aux = this.incidents.filter(item => item.AvisoID == resp.id);
          if (aux.length > 0){
            this.incFromPush = aux[0];
            this.openDetail(this.incFromPush)
          }else{
            this.showAlert(this.translate.instant("incidents.atentionAlertTitle"), this.translate.instant("incidents.incNotFound"), this.translate.instant("app.btnAccept"));
          }
          this.incFromPush = undefined;
          this.storage.set('incFromPush', '');          
        }
      });
  }

  onInput(search) {
    this.searching = true;
  }

  segmentChange() {
    this.incidents = this.incidentsSort.transform(this.incidentsOriginal, this.order, 'desc', this.latLng);
  }
  
  getMisIncidencias(ciudadanoID, token, refresher) {
        this.incidentService.getMisIncidencias(ciudadanoID, token)
                            .subscribe(
                                (result) =>{
                                  this.incidents = result;
                                  this.incidentsOriginal = result;
                                  this.loadingComponent.dismiss();                                  
                                  if (refresher != undefined) refresher.complete(); 
                                  if (this.incFromPushPending) this.openDetailFromPush(); 
                                },
                                error =>{
                                  this.errorMessage = <any>error;
                                  this.loadingComponent.dismiss();
                                  if (refresher != undefined) refresher.complete(); 
                                });
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.getMisIncidencias(this.user.CiudadanoID, this.user.token, refresher);
  }
  
  openReview(incident, slidingItem) {
    slidingItem.close();
    this.nav.push(ReviewPage, incident);
  }
  
  classIncident(incident) {
    var result;
    switch (incident.EstadoAvisoID) {
      case 12:
        result = "incident-state-12";
        break;
        
      case 9:
      result = "incident-state-9";
      break;
      
      case 11:
      result = "incident-state-11";
      break;
      
      case 13:
      result = "incident-state-13";
      break;
    
      default:
        break;
    }
    return result;
  }

  styleIncident(incident){
    return "'border-left-color': 'blue'";
  }

  distance(incident) {
    if(!this.latLng){
      return "Calculating distance..."
    }else{
      return this.utils.roundTwoDecimals(this.utils.getDistanceFromLatLonInKm(incident["Lat"], incident["Lng"], this.latLng.lat, this.latLng.lng)) + " km";
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
