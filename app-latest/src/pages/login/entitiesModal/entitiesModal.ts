import {Component} from '@angular/core';
import {Platform, NavParams, ViewController} from 'ionic-angular';
import { FormControl } from '@angular/forms';
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
  entitiesSearchControl: FormControl;
  searching: any = false;
  
  constructor(public platform: Platform
    , public params: NavParams
    , public viewCtrl: ViewController
    , public translate: TranslateService) {
      
      this.aytos = params.data;
      this.aytoSuggested = this.aytos[0];
      this.searchText = '';
      
      this.entitiesSearchControl = new FormControl();

      this.aytosOriginal = this.aytos;
      /*this.aytos.shift();
      console.log(this.aytos);*/
  }

ionViewDidLoad() {
 
        this.entitiesSearchControl.valueChanges.debounceTime(700).subscribe(search => { 
            this.searching = false;
            this.aytos = this.filter(this.aytosOriginal, search.toLowerCase()); 
        });
 
  }

  filter(value, args:string){
    if (args){
        return value.filter((item)=>
            item.Nombre.toLowerCase().indexOf(args) != -1
        );
    }
    return value;
  }

  dismiss(ayto) {
    setTimeout(() => {
        this.viewCtrl.dismiss(ayto);
    });
  }
  
  inputSearch($event) {
        this.searching = true;
  }
  
}