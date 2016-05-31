import {NavController, NavParams, MenuController, Alert, Modal, ActionSheet, Storage, SqlStorage} from 'ionic-angular';
import {Page, ViewController, Platform} from 'ionic-angular';
import {forwardRef, NgZone} from '@angular/core';
import {AndroidAttribute} from './../../../../../directives/global.helpers';
import {CommentsPage} from './comments/comments';
import {ChatPage} from './chat/chat';
import {ReviewPage} from './review/review';
import {GeolocationProvider} from './../../../../../providers/geolocation';
import {IncDetailService} from './incDetailService';


@Page({
  templateUrl: './build/pages/tabs/content/incidents/incDetail/incDetail.html',
  directives: [forwardRef(() => AndroidAttribute)],
  providers: [GeolocationProvider, IncDetailService]
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

  constructor(private platform: Platform
    , private menu: MenuController
    , private params: NavParams
    , private nav: NavController
    , private zone: NgZone
    , private geo: GeolocationProvider
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

    this.geo.getLocation().then(location =>{
      this.location = location;
      this.latLng = this.location.latLng;
      this.startAddress = this.location.startAddress;
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
        window.alert('Directions request failed due to ' + status);
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
    let aux = Modal.create(ChatPage, messages);
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
          text: 'Review',
          handler: () => {
            this.openReview(incident);
          }
        },
        {
          text: 'Share',
          handler: () => {
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
                this.showAlert("Error", "There is some errort", "OK");
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
