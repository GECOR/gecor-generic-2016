import {Component, Input} from '@angular/core';
//import {IONIC_DIRECTIVES} from 'ionic-angular';

@Component({
  selector: 'spinner-loading',
  templateUrl: 'spinnerLoading.html',
  //directives: [IONIC_DIRECTIVES] // makes all Ionic directives available to your component
})
export class SpinnerLoading {
    @Input() title;
    
    constructor() {
    }
}