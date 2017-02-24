import {Component} from '@angular/core';
import {NavController, MenuController} from 'ionic-angular';
import {SettingsPage} from './../settings';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'entities-page',
  templateUrl: 'entities.html',
  //directives: [forwardRef(() => AndroidAttribute)],
   //pipes: [TranslatePipe]
})
export class EntitiesPage {
  user: any = {};
  constructor(private nav: NavController
    , private menu: MenuController
    , public storage: Storage) {
      this.storage.get('user').then((user) => {
          this.user = JSON.parse(user);
      });
  }

  chooseEntitie() {
    this.nav.push(SettingsPage);
  }

}
