import {Component} from '@angular/core';
import {Platform, NavParams, ViewController} from 'ionic-angular';
import { FormControl } from '@angular/forms';
import {EntitiesModalSearchPipe} from './entitiesModalPipe';
//import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {TranslateService} from 'ng2-translate';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'entities-modal-page',
  templateUrl: 'entitiesModal.html',
  ////pipes: [EntitiesModalSearchPipe]//, TranslatePipe
})

export class EntitiesModalPage {
  character;
  aytos: any[];
  aytosOriginal: any[];
  aytoSuggested: any = {};
  searchText: any;
  searchControl: FormControl;
  searching: any = false;
  
  constructor(public platform: Platform
    , public params: NavParams
    , public viewCtrl: ViewController
    , public translate: TranslateService) {
      
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