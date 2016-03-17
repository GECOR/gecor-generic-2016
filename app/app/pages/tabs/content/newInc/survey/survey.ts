import {Page, NavController, NavParams,} from 'ionic-angular';
import {forwardRef} from 'angular2/core';
import {AndroidAttribute} from './../../../../../directives/global.helpers';
import {IncidentsPage} from './../../incidents/incidents';

@Page({
  templateUrl: 'build/pages/tabs/content/newInc/survey/survey.html',
  directives: [forwardRef(() => AndroidAttribute)]
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
