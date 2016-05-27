import {IonicApp, Modal, Platform, NavController, NavParams, Page, ViewController} from 'ionic-angular';
import {EntitiesModalSearchPipe} from './entitiesModalPipe';

@Page({
  templateUrl: './build/pages/login/entitiesModal/entitiesModal.html',
  pipes: [EntitiesModalSearchPipe]
})

export class EntitiesModalPage {
  character;
  aytos: any[];
  aytoSuggested: any;
  searchText: any;
  constructor(public platform: Platform
    , public params: NavParams
    , public viewCtrl: ViewController) {
      
      this.aytos = params.data;
      this.aytoSuggested = this.aytos[0];
      this.searchText = '';
      
      /*this.aytos.shift();
      console.log(this.aytos);*/
  }

  dismiss(ayto) {
    setTimeout(() => {
        this.viewCtrl.dismiss(ayto);
    });
  }
  
  inputSearch(search) {
    console.log(search.value);
  }
  
}