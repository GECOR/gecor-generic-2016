import {Component} from '@angular/core';
import {NavController, NavParams,} from 'ionic-angular';
import {IncidentsPage} from './../../incidents/incidents';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'survey-page',
  templateUrl: 'survey.html'
})
export class SurveyPage {
  user: any = {};
  constructor(private nav: NavController
  , private params: NavParams
  , public storage: Storage) {
    this.storage.get('user').then((user) => {
        this.user = JSON.parse(user);
    });
  }

  cancelSurvey() {
    this.nav.push(IncidentsPage, {});
  }

  sendSurvey() {
    this.nav.push(IncidentsPage, {});
  }
}
