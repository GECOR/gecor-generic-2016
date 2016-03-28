import {Component, Input} from 'angular2/core';
import {IONIC_DIRECTIVES} from 'ionic-angular';

@Component({
  selector: 'spinner-loading',
  templateUrl: 'build/directives/spinnerLoading/spinnerLoading.html',
  directives: [IONIC_DIRECTIVES] // makes all Ionic directives available to your component
})
export class SpinnerLoading {
    @Input() title;
    
    constructor() {
    }
}