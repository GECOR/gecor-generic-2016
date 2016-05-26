import {IonicApp, Modal, Platform, NavController, NavParams, Page, ViewController} from 'ionic-angular';

@Page({
  templateUrl: './build/pages/login/entitiesModal/entitiesModal.html'
})

export class EntitiesModalPage {
  character;
  aytos: any[];
  aytoSuggested: any;
  constructor(public platform: Platform
    , public params: NavParams
    , public viewCtrl: ViewController) {
      
      this.aytos = params.data;
      this.aytoSuggested = this.aytos[0];
      
      /*this.aytos.shift();
      console.log(this.aytos);*/
  }

  dismiss(ayto) {
    setTimeout(() => {
        this.viewCtrl.dismiss(ayto);
    });
  }
  
}