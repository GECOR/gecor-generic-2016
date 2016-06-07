import {IonicApp, Modal, Platform, NavController, NavParams, Page, ViewController} from 'ionic-angular';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

@Page({
  templateUrl: './build/pages/signin/legalTerms/legalTerms.html',
  pipes: [TranslatePipe]
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