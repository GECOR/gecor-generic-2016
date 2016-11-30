import {Component, forwardRef} from '@angular/core';
import {Platform, NavController, NavParams, ViewController} from 'ionic-angular';
import {TranslatePipe} from 'ng2-translate';

@Component({
  selector: 'legal-terms-page',
  templateUrl: 'legalTerms.html',
  ////pipes: [TranslatePipe]
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