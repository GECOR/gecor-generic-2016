import {Component} from '@angular/core';
import {Platform, NavParams, ViewController} from 'ionic-angular';

@Component({
  selector: 'legal-terms-page',
  templateUrl: 'legalTerms.html'
})

export class LegalTermsPage {
  aytoSuggested: any;
  constructor(public platform: Platform
    , public params: NavParams
    , public viewCtrl: ViewController) {
      
      this.aytoSuggested = params.data;
  }

  dismiss() {
    setTimeout(() => {
        this.viewCtrl.dismiss();
    });
  }
  
}