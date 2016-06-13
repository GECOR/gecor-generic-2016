import {Component, forwardRef} from '@angular/core';
import {NavController, NavParams,} from 'ionic-angular';
import {AndroidAttribute} from './../../../../../directives/global.helpers';
import {IncidentsPage} from './../../incidents/incidents';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

@Component({
  templateUrl: 'build/pages/tabs/content/newInc/survey/survey.html',
  directives: [forwardRef(() => AndroidAttribute)],
  pipes: [TranslatePipe]
})
export class SurveyPage {
  constructor(private nav: NavController, private params: NavParams) {

  }

  cancelSurvey() {
    this.nav.push(IncidentsPage, {});
  }

  sendSurvey() {
    this.nav.push(IncidentsPage, {});
  }
}
