import {Component, forwardRef, NgZone} from '@angular/core';
import {NavController, NavParams, MenuController, Alert, Modal, ActionSheet, Storage, SqlStorage, ViewController, Platform} from 'ionic-angular';
import {AndroidAttribute} from './../../../../../directives/global.helpers';
import {CommentsPage} from './comments/comments';
import {ChatPage} from './chat/chat';
import {ReviewPage} from './review/review';
import {GeolocationProvider} from './../../../../../providers/geolocation';
import {IncDetailService} from './incDetailService';
import {TranslatePipe, TranslateService} from 'ng2-translate/ng2-translate';

@Component({
  templateUrl: './build/pages/tabs/content/incidents/incDetail/incDetail.html',
  directives: [forwardRef(() => AndroidAttribute)],
  providers: [GeolocationProvider, IncDetailService],
  pipes: [TranslatePipe]
})
export class IncDetailPage {
  isAndroid: any;
  //incident: Object;
  map: any;
  markerArray: any[];
  location: any;
  latLng: google.maps.LatLng;
  startAddress: string;
  endAddress: string;
  travelMode: string;
  timeTravel: string;
  distanceTravel: string;
  directionsService: any;
  geocoderService: any;
  directionsDisplay: any;
  stepDisplay: any;
  incident: any;
  errorMessage: any;
  storage: any;
  user: any = {};
  entity: any;

  constructor(private platform: Platform
    , private menu: MenuController
    , private params: NavParams
    , private nav: NavController
    , private zone: NgZone
    , private geo: GeolocationProvider
    , private translate : TranslateService
    , private incDetailService: IncDetailService) {
    this.platform = platform;
    this.isAndroid = platform.is('android');
    this.incident = params.data;

    this.map = null;
    this.markerArray = [];
    this.endAddress = this.incident.route;
    this.travelMode = 'WALKING';
    this.timeTravel = '0 min';
    this.distanceTravel = '0 km';
    
    this.storage = new Storage(SqlStorage);
    this.storage.get('user').then((user) => {
        this.user = JSON.parse(user);
    });
    
    this.storage.get('entity').then((entity) => {
        this.entity = JSON.parse(entity);
    });

    this.geo.getLocation().then(location =>{
      this.location = location;
      if (this.location.error){
        this.latLng = new google.maps.LatLng(this.entity.Latitud, this.entity.Longitud);
        this.startAddress = this.translate.instant("incidents.incdetail.addresOf") + this.entity.Nombre;
      }else{
        this.latLng = this.location.latLng;
        this.startAddress = this.location.startAddress;
      }       
      setTimeout(() =>
          this.loadMap()
        , 100);
      });
  }

  //MAP  
  loadMap() {//ngAfterViewInit
    this.directionsService = new google.maps.DirectionsService();
    let mapOptions = {
        center: this.latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(document.getElementById("mapIncident"), mapOptions);

    this.directionsDisplay = new google.maps.DirectionsRenderer({map: this.map});
    this.stepDisplay = new google.maps.InfoWindow;

    // Display the route between the initial start and end selections.
    this.calculateAndDisplayRoute(this.directionsDisplay, this.stepDisplay);

  }

  calculateAndDisplayRoute(directionsDisplay, stepDisplay) {
    // Retrieve the start and end locations and create a DirectionsRequest using
    // WALKING directions.

    this.directionsService.route({
      origin: this.startAddress,
      destination: this.incident.DesUbicacion,
      travelMode: google.maps.TravelMode.WALKING
    }, (response, status) => {
      // Route the directions and pass the response to a function to create
      // markers for each step.
      //console.log(response);
      if (status === google.maps.DirectionsStatus.OK) {
        /*document.getElementById('warnings-panel').innerHTML =
            '<b>' + response.routes[0].warnings + '</b>';*/
        this.zone.run(() => {
          this.timeTravel = response.routes[0].legs[0].duration.text;
          this.distanceTravel = response.routes[0].legs[0].distance.text;
        });

        directionsDisplay.setDirections(response);
        //Muestra markers en los cambios de dirección
        //this.showSteps(response, stepDisplay);
      } else {
        //window.alert('Directions request failed due to ' + status);
        this.showAlert(this.translate.instant("app.genericErrorAlertTitle"), this.translate.instant("incidents.incdetail.directionRequestFailed"), this.translate.instant("app.btnAccept"));
      }
    });
  }

  showSteps(directionResult, stepDisplay) {
    // For each step, place a marker, and add the text to the marker's infowindow.
    // Also attach the marker to an array so we can keep track of it and remove it
    // when calculating new routes.
    let myRoute = directionResult.routes[0].legs[0];

    for (let i = 0; i < myRoute.steps.length; i++) {
      let marker = new google.maps.Marker;
      marker.setMap(this.map);
      let location = new google.maps.LatLng(this.incident.Lat, this.incident.Lng);
      marker.setPosition(location);
      this.attachInstructionText(marker, myRoute.steps[i].instructions, stepDisplay);
    }
  }

  attachInstructionText(marker, text, stepDisplay) {
    google.maps.event.addListener(marker, 'click', function() {
      console.log(text);
      stepDisplay.setContent(text);
      stepDisplay.open(this.map, marker);
    });
  }
  //END MAP

  openComments() {
    this.nav.push(CommentsPage, this.incident);
  }

  openChat(messages) {
    let aux = Modal.create(ChatPage, {"messages": messages, "user": this.user, "incident": this.incident});
    this.nav.present(aux);
  }

  openReview(incident) {
    this.nav.push(ReviewPage, incident);
  }

  showMore(incident){
    let actionSheet = ActionSheet.create({
      title: '',
      buttons: [
        {
          text: this.translate.instant("incidents.incdetail.actionSheetReview"),
          handler: () => {
            this.openReview(incident);
          }
        },
        {
          text: this.translate.instant("incidents.incdetail.actionSheetShare"),
          handler: () => {
          }
        },
        {
          text: this.translate.instant("app.btnCancel"),
          role: 'cancel',
          handler: () => {
            console.log("Cancel clicked");
          }
        }
      ]
    });
    this.nav.present(actionSheet);
  }
  
  addLike(){
    let likes = [];
    let likesFiltered = [];
    this.storage.get('likes').then((result) => {        
        if (result != undefined && JSON.parse(result).constructor === Array){
          likes = JSON.parse(result);
          likesFiltered = likes.filter(item => item == this.incident.AvisoID);
        }
        if (likesFiltered.length == 0){
          this.incDetailService.addLike(this.user.token, this.incident.AvisoID)
            .subscribe((result) =>{
              if (result[0].RowsAffected > 0){
                likes.push(this.incident.AvisoID);
                this.storage.set('likes', JSON.stringify(likes));
                this.incident.Likes ++;
              }else{
                this.showAlert(this.translate.instant("app.genericErrorAlertTitle"), this.translate.instant("app.genericErrorAlertMessage"), this.translate.instant("app.btnAccept"));
              }
            },
            error =>{
              this.errorMessage = <any>error;
            });    
        }
    });
        
  }
  
  showAlert(title, subTitle, okButton){
    let alert = Alert.create({
      title: title,
      subTitle: subTitle,
      buttons: [okButton]
    });
    this.nav.present(alert);
  }
}
