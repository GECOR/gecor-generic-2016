import {Component} from '@angular/core';
import {Platform, NavParams, ViewController} from 'ionic-angular';
import {EntitiesModalSearchPipe} from './entitiesModalPipe';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

@Component({
  templateUrl: './build/pages/login/entitiesModal/entitiesModal.html',
  pipes: [EntitiesModalSearchPipe, TranslatePipe]
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