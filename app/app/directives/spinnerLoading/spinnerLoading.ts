import {Component, Input} from 'angular2/core'

@Component({
  selector: 'spinner-loading',
  template: '<div login-spinner-back><div login-spinner><p>{{title}}</p><ion-spinner></ion-spinner></div></div>'
})
export class SpinnerLoading {
    @Input() title;
    
    constructor() {
    }
}