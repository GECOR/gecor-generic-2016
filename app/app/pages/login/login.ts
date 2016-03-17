import {Page, NavController, MenuController, Alert} from 'ionic-angular';
import {forwardRef} from 'angular2/core';
import {AndroidAttribute} from './../../directives/global.helpers';
import {MainMenuContentPage} from './../main/main';
import {TabsPage} from './../tabs/tabs';
import {SignInPage} from './../signin/signin';
import {GeolocationProvider} from './../../providers/geolocation';
import {EntitiesPage} from './entities/entities';

@Page({
  templateUrl: './build/pages/login/login.html',
  directives: [forwardRef(() => AndroidAttribute)],
  providers: [GeolocationProvider]
})
export class LoginPage {
    constructor(private nav: NavController
      , private menu: MenuController
      , private geo: GeolocationProvider) {

        geo.getLocation().then(location =>{
          console.log(location);
        });

    }

    openMainPage() {
      //this.nav.push(MainMenuContentPage);
      this.nav.push(TabsPage);
    }

    openEntitiesPage() {
      //this.nav.push(MainMenuContentPage);
      this.nav.push(EntitiesPage);
    }

    forgottenPass() {
      let prompt = Alert.create({
        title: 'Forgotten password',
        message: "Enter email to reset password",
        inputs: [
          {
            name: 'email',
            placeholder: 'Email'
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Reset',
            handler: data => {
              console.log('Reset clicked');
            }
          }
        ]
      });
      this.nav.present(prompt);
    }

    openSignInPage() {
      this.nav.push(SignInPage);
    }
}
