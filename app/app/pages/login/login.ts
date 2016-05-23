import {Page, NavController, MenuController, Alert, Storage, SqlStorage} from 'ionic-angular';
import {forwardRef, NgZone} from '@angular/core';
import {AndroidAttribute} from './../../directives/global.helpers';
import {MainMenuContentPage} from './../main/main';
import {TabsPage} from './../tabs/tabs';
import {SignInPage} from './../signin/signin';
import {GeolocationProvider} from './../../providers/geolocation';
import {EntitiesPage} from './entities/entities';
import {LoginService} from './loginService';
import {User} from './loginInterface';
import {SpinnerLoading} from './../../directives/spinnerLoading/spinnerLoading';
import {Facebook} from 'ionic-native';

@Page({
  templateUrl: './build/pages/login/login.html',
  directives: [forwardRef(() => AndroidAttribute), SpinnerLoading],
  providers: [GeolocationProvider, LoginService]
})
export class LoginPage {
    errorMessage: any;
    user: any = {};
    email: any;
    password: any;
    loginLoading: any;
    aytos: any=[];
    storage: any;
    
    constructor(private nav: NavController
      , private menu: MenuController
      , private geo: GeolocationProvider
      , private loginService: LoginService
      , private zone: NgZone) {
          
        this.loginLoading = false;
        
        this.geo.getLocation().then(location =>{
          this.getAyuntamientosPorDistancia(location);
        });
        
        this.storage = new Storage(SqlStorage);

    }
    
    onPageWillEnter() {
        
    }

    openMainPage() {
      //this.nav.push(MainMenuContentPage);
      this.nav.push(TabsPage);
    }

    openEntitiesPage() {
      this.nav.push(EntitiesPage, this.aytos);
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
    
    getAyuntamientosPorDistancia(location) {
        this.loginService.getAyuntamientosPorDistancia(location.lat, location.lng)
                            .subscribe(
                                (aytos) =>{
                                    this.aytos = aytos;                                                                        
                                },
                                error =>  this.errorMessage = <any>error);
    }
    
    loginUser() {
        if (this.validateLogin()){
            this.loginLoading = true;
            this.loginService.loginUser(this.email, this.password)
                            .subscribe(
                                (user) =>{                                    
                                    this.user = user;
                                    if (this.user.token != '' && this.user.token != null) {
                                        this.configData();                                      
                                        this.storage.set('user', JSON.stringify(this.user));
                                    }else{
                                        this.loginLoading = false;
                                        let prompt = Alert.create({
                                            title: 'Oops!',
                                            message: "The user was incorrect",
                                            buttons: ['Accept']
                                        });
                                        this.nav.present(prompt);
                                    }
                                },
                                error =>  this.errorMessage = <any>error);
        }
        
    }
    
    loginFacebookUser() {
        Facebook.login(["email"]).then((result) => {
            console.log(result)
        })
    }
    
    loginGooglePlusUser(){
         window.plugins.googleplus.login(
            {},
             (obj)=> {
                console.log(obj);
            },
            (msg)=> {
                console.error(msg);
            }
        );
    }
    
    validateLogin() {
        if (this.email == '' || this.password == '') {
            let prompt = Alert.create({
                title: 'Data is empty',
                message: "Please enter an email and password",
                buttons: ['Accept']
            });
            this.nav.present(prompt);
        }else{
            return true;
        }
        
    }
    
    configData() {
        this.loginService.getTipologiaPorAyuntamiento(this.user.token)
                            .subscribe(
                                (data) =>{
                                    console.log(data);
                                    this.storage.set('familias', JSON.stringify(data.Familias));
                                    this.storage.set('tiposElementos', JSON.stringify(data.Elementos));
                                    this.storage.set('tiposIncidencias', JSON.stringify(data.Incidencias));
                                    this.nav.push(TabsPage);
                                },
                                error =>  this.errorMessage = <any>error);
    }
}
