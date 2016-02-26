import {NavController, NavParams, MenuController, Alert} from 'ionic-framework/ionic';
import {Page, ViewController, Platform} from 'ionic-framework/ionic';
import {forwardRef, NgZone} from 'angular2/core';
import {AndroidAttribute} from './../../../../../directives/global.helpers';



@Page({
  templateUrl: './build/pages/tabs/content/incidents/incDetail/incDetail.html',
  directives: [forwardRef(() => AndroidAttribute)],
})
export class IncDetailPage {
  isAndroid: any;
  incident: Object;
  map: any;
  markerArray: any[];
  latLng: any;
  startAddress: string;
  endAddress: string;
  travelMode: string;
  timeTravel: string;
  distanceTravel: string;
  directionsService: any;
  geocoderService: any;
  directionsDisplay: any;
  stepDisplay: any;
  constructor(private platform: Platform
    , private menu: MenuController
    , private params: NavParams
    , private nav: NavController
    , private zone: NgZone) {
    this.platform = platform;
    this.isAndroid = platform.is('android');
    this.incident = params.data;

    this.map = null;
    this.markerArray = [];
    this.endAddress = this.incident.route;
    this.travelMode = 'WALKING';
    this.timeTravel = '0 min';
    this.distanceTravel = '0 km';

    this.initGeolocation();
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

    this.directionsDisplay = new google.maps.DirectionsRenderer({map: this.map});
    this.stepDisplay = new google.maps.InfoWindow;

    // Display the route between the initial start and end selections.
    this.calculateAndDisplayRoute(this.directionsDisplay, this.stepDisplay);

  }

  centerMap() {
    this.map.setCenter(this.latLng);
  }

  initGeolocation() {
    let options = {maximumAge: 5000, timeout: 15000, enableHighAccuracy: true};
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.geocoderService = new google.maps.Geocoder;

        this.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        this.geocoderService.geocode({'location': this.latLng}, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results[0]) {
              _this.startAddress = results[0].formatted_address;
              _this.loadMap();
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
              this.loadMap();
            }
          }
          ]
        });
        this.nav.present(alert);
      }, options);
  }




  calculateAndDisplayRoute(directionsDisplay, stepDisplay) {
    // First, remove any existing markers from the map.
    for (let i = 0; i < this.markerArray.length; i++) {
      this.markerArray[i].setMap(null);
    }

    // Retrieve the start and end locations and create a DirectionsRequest using
    // WALKING directions.

    this.directionsService.route({
      origin: this.startAddress,//document.getElementById('start').value,
      destination: this.endAddress,//document.getElementById('end').value,
      travelMode: google.maps.TravelMode.WALKING
    }, (response, status) => {
      // Route the directions and pass the response to a function to create
      // markers for each step.
      //console.log(response);
      if (status === google.maps.DirectionsStatus.OK) {
        /*document.getElementById('warnings-panel').innerHTML =
            '<b>' + response.routes[0].warnings + '</b>';*/

        console.log(response.routes);
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
      let marker = this.markerArray[i] = this.markerArray[i] || new google.maps.Marker;
      marker.setMap(this.map);
      marker.setPosition(myRoute.steps[i].start_location);
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

  addMarker(){
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    let content = "<h4>Information!</h4>";

    this.addInfoWindow(marker, content);
   }

 addInfoWindow(marker, content){
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', function(){
      infoWindow.open(this.map, marker);
    });
  }
  //END MAP


}
