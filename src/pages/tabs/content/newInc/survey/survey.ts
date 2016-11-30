import {Component, forwardRef} from '@angular/core';
import {NavController, NavParams,} from 'ionic-angular';
import {AndroidAttribute} from './../../../../../directives/global.helpers';
import {IncidentsPage} from './../../incidents/incidents';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'survey-page',
  templateUrl: 'survey.html',
  //directives: [forwardRef(() => AndroidAttribute)],
  //pipes: [TranslatePipe]
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
