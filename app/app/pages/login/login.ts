import {Page, NavController, MenuController, Alert, Storage, SqlStorage} from 'ionic-angular';
import {forwardRef} from 'angular2/core';
import {AndroidAttribute} from './../../directives/global.helpers';
import {MainMenuContentPage} from './../main/main';
import {TabsPage} from './../tabs/tabs';
import {SignInPage} from './../signin/signin';
import {GeolocationProvider} from './../../providers/geolocation';
import {EntitiesPage} from './entities/entities';
import {LoginService} from './loginService';
import {User} from './loginInterface';

@Page({
  templateUrl: './build/pages/login/login.html',
  directives: [forwardRef(() => AndroidAttribute)],
  providers: [GeolocationProvider, LoginService]
})
export class LoginPage {
    errorMessage: any;
    user: User;
    email: any;
    password: any;
    
    constructor(private nav: NavController
      , private menu: MenuController
      , private geo: GeolocationProvider
      , private loginService: LoginService) {

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
    
    loginUser() {
        this.loginService.loginUser(this.email, this.password)
                        .subscribe(
                            (user) =>{
                                this.user = user;
                                if (this.user.Email != '') {
                                    this.nav.push(TabsPage);
                                    let storage = new Storage(SqlStorage);
                                    storage.set('user', JSON.stringify(this.user) );
                                }
                            },
                            error =>  this.errorMessage = <any>error);
    }
}
