import {Component, Input, OnInit} from '@angular/core';
import {Platform, NavParams, ViewController} from 'ionic-angular';

@Component({
  selector: 'summary-component',
  templateUrl: 'summary.html'
})

export class SummaryComponent implements OnInit {
  
  @Input() incidence;
  @Input() newIncident: Function;

  constructor(public platform: Platform
    , public params: NavParams
    , public viewCtrl: ViewController) {}

  
  ngOnInit(){
    if (!this.incidence.tipoElemento){
      this.incidence.tipoElemento = {};
      this.incidence.tipoElemento.DesTipoElemento = ""
    }

    if (!this.incidence.tipoIncidencia){
      this.incidence.tipoIncidencia = {};
      this.incidence.tipoIncidencia.TipoInc = ""
    }

    if (!this.incidence.imgs){
      this.incidence.imgs = [];
    }

  }

}