import {Page, NavController, MenuController, Alert, Storage, SqlStorage, Loading, Modal} from 'ionic-angular';
import {forwardRef, NgZone} from '@angular/core';
import {AndroidAttribute} from './../../directives/global.helpers';
import {MainMenuContentPage} from './../main/main';
import {TabsPage} from './../tabs/tabs';
import {SignInPage} from './../signin/signin';
import {GeolocationProvider} from './../../providers/geolocation';
import {EntitiesPage} from './entities/entities';
import {LoginService} from './loginService';
import {User} from './loginInterface';
import {Facebook} from 'ionic-native';
import {EntitiesModalPage} from './entitiesModal/entitiesModal';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

@Page({
  templateUrl: './build/pages/login/login.html',
  directives: [forwardRef(() => AndroidAttribute)],
  providers: [GeolocationProvider, LoginService],
  pipes: [TranslatePipe]
})
export class LoginPage {
    errorMessage: any;
    user: any = {};
    email: any;
    password: any;
    aytos: any=[];
    storage: any;
    loadingComponent: any;
    aytoSuggested: any = {};
    entitiesModal: any;
    location: any;
    language: string;
    
    constructor(private nav: NavController
      , private menu: MenuController
      , private geo: GeolocationProvider
      , private loginService: LoginService
      , private zone: NgZone) {
        
        this.storage = new Storage(SqlStorage);
        
        this.storage.get('language').then((language) => {
            this.language = language;
        })
        
        this.loadingComponent = Loading.create({
                content: 'Please wait...'
            });
    }
    
    onPageWillEnter() {
        
    }
    
    onPageLoaded() {
        this.geo.getLocation().then(location =>{
            this.location = location;
            if (this.location.error){
                //Problems with geolocation
                this.showAlert("Error", "We have problems to locate you, please choose a entity manually.", "OK");
                this.aytoSuggested.AyuntamientoID = -1;
                this.aytoSuggested.Nombre = "Choose a entity manually";
                this.getAyuntamientosPorDistancia(undefined, this.language);
            }else{
                this.getAyuntamientosPorDistancia(location, this.language);
            }
            
        });
    }

    openMainPage() {
      this.nav.push(TabsPage);
    }

    openEntitiesPage() {
      //this.nav.push(EntitiesPage, this.aytos);
      this.entitiesModal = Modal.create(EntitiesModalPage, this.aytos);      
      this.entitiesModal.onDismiss(data => {
        this.aytoSuggested = data;
        this.storage.set('entity', JSON.stringify(this.aytoSuggested));
      });     
      this.nav.present(this.entitiesModal);  
        
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
      this.nav.push(SignInPage, this.aytoSuggested);
    }
    
    getAyuntamientosPorDistancia(location, language) {
        if (location == undefined){
            location = {};
            location.lat = 0;
            location.lng = 0;
        }
        this.loginService.getAyuntamientosPorDistancia(location.lat, location.lng, language)
                            .subscribe(
                                (aytos) =>{
                                    this.aytos = aytos;
                                    if (this.aytoSuggested.AyuntamientoID != -1){
                                        this.aytoSuggested = aytos[0];
                                        this.storage.set('entity', JSON.stringify(this.aytoSuggested));
                                    }                                                                         
                                },
                                error =>  this.errorMessage = <any>error);
    }
    
    loginUser() {
        if (this.validateLogin()){          
            this.nav.present(this.loadingComponent);
            //this.loginLoading = true;
            this.loginService.loginUser(this.email.trim(), this.password.trim(), this.aytoSuggested.AyuntamientoID)
                            .subscribe(
                                (user) =>{                                    
                                    this.user = user;
                                    this.user.AyuntamientoNombre = this.aytoSuggested.Nombre;                                 
                                    
                                    if (this.user.token != '' && this.user.token != null) {
                                        this.configData();                                      
                                        this.storage.set('user', JSON.stringify(this.user));
                                    }else{
                                        //this.loginLoading = false;
                                        this.loadingComponent.dismiss();
                                        let prompt = Alert.create({
                                            title: 'Oops!',
                                            message: "The user was incorrect",
                                            buttons: ['Accept']
                                        });
                                        this.nav.present(prompt);
                                    }
                                },
                                error => {
                                    this.errorMessage = <any>error;
                                    this.loadingComponent.dismiss();
                                });
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
            this.showAlert("Data is empty", "Please enter an email and password", "Accept");
            return false;
        }else if(this.aytoSuggested.AyuntamientoID == -1){
            this.showAlert("Entity not found", "Please choose a entity manually", "Accept");
            return false;
        }else{
            return true;
        }
        
    }
    
    configData() {
        this.loginService.getTipologiaPorAyuntamiento(this.user.token)
            .subscribe(
                (data) =>{
                    this.storage.set('familias', JSON.stringify(data.Familias));
                    this.storage.set('tiposElementos', JSON.stringify(data.Elementos));
                    this.storage.set('tiposIncidencias', JSON.stringify(data.Incidencias));
                    this.loginService.getEstadosPorAyuntamiento(this.user.token)
                        .subscribe(
                            (data) =>{
                                this.storage.set('estados', JSON.stringify(data));
                                this.loginService.getResponsablesPorAyuntamiento(this.user.token)
                                    .subscribe(
                                        (data) =>{
                                            this.storage.set('responsables', JSON.stringify(data));
                                            this.loadingComponent.dismiss();
                                            this.nav.push(TabsPage);
                                        },
                                        error =>  this.errorMessage = <any>error);
                            },
                            error =>  this.errorMessage = <any>error);
                },
                error =>  this.errorMessage = <any>error);
                                
        
    }
    
    showAlert(title, subTitle, okButton){
    let alert = Alert.create({
      title: title,
      subTitle: subTitle,
      buttons: [okButton]
    });
    this.nav.present(alert);
  }
}
