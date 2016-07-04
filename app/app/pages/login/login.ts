import {Component, forwardRef, NgZone} from '@angular/core';
import {Platform, NavController, MenuController, Alert, Storage, SqlStorage, Loading, Modal} from 'ionic-angular';
import {TranslateService, TranslateLoader, TranslateStaticLoader, TranslatePipe} from 'ng2-translate/ng2-translate';
import {AndroidAttribute} from './../../directives/global.helpers';
import {MainMenuContentPage} from './../main/main';
import {TabsPage} from './../tabs/tabs';
import {SignInPage} from './../signin/signin';
import {GeolocationProvider} from './../../providers/geolocation';
import {DBProvider} from './../../providers/db';
//import {EntitiesPage} from './entities/entities';
import {LoginService} from './loginService';
import {User} from './loginInterface';
import {Facebook, SQLite} from 'ionic-native';
import {EntitiesModalPage} from './entitiesModal/entitiesModal';
import {UtilsProvider} from './../../providers/utils';
import {defaultLanguage, folderLanguage, sourceLanguage, compareLanguage, useSQLiteOniOS} from './../../appConfig';
import {Globalization} from 'ionic-native';

@Component({
  templateUrl: './build/pages/login/login.html',
  directives: [forwardRef(() => AndroidAttribute)],
  providers: [GeolocationProvider, LoginService, UtilsProvider, DBProvider],
  pipes: [TranslatePipe]
})
export class LoginPage {
    errorMessage: any;
    user: any = {};
    email: string = "";
    password: string = "";
    aytos: any=[];
    storage: any;
    loadingComponent: any;
    aytoSuggested: any = {};
    entitiesModal: any;
    location: any;
    language: string;
    window: any;
    
    constructor(private nav: NavController
      , private menu: MenuController
      , private geo: GeolocationProvider
      , private loginService: LoginService
      , private utils: UtilsProvider
      , private translate : TranslateService
      , private zone: NgZone
      , private platform: Platform
      , private db: DBProvider) {
        
        /*this.storage.get('language').then((language) => {
            if (language == undefined){
                this.language = defaultLanguage;
            }else{
                this.language = language;
            }            
        })*/

        this.window = window;

        this.loadingComponent = utils.getLoading(this.translate.instant("app.loadingMessage"));

        if(platform.is('ios') && useSQLiteOniOS){
            this.initDB();
            db.getValue('language').then((language) => {
                if (language == ""){
                    this.language = defaultLanguage;
                }else{
                    this.language = language.toString();
                }
            });
        }else{
            this.storage = new Storage(SqlStorage);
        }
    }

    initDB(){
        this.db.initDB().then((result) =>{

            console.log(result);
                this.db.getValue('user').then((user) =>{
                if(user != ""){        
                    this.user = JSON.parse(user.toString());
                    this.nav.push(TabsPage);
                }
            });

            Globalization.getPreferredLanguage().then((obj) =>{//get device language
                console.log(obj.value);                
                this.db.setKey('language', obj.value.split('-')[0]).then((result) =>{
                console.log(result);                                                                 
                },
                error =>{
                    console.log(error);
                });
            }, (err)=>{
                console.log(err); 
                this.db.setKey('language', defaultLanguage).then((result) =>{
                console.log(result);                                                                 
                },
                error =>{
                    console.log(error);
                });
            });

        });//end db init
    }

    ionViewWillEnter() {}
    
    ionViewLoaded() {
        this.geo.getLocation().then(location =>{
            this.location = location;
            if (this.location.error){
                //Problems with geolocation                
                this.getAyuntamientosPorDistancia(undefined, this.language, true);
            }else{
                this.getAyuntamientosPorDistancia(location, this.language, false);
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

        if(this.platform.is('ios') && useSQLiteOniOS){
             this.db.setKey('entity', JSON.stringify(this.aytoSuggested)).then((result) =>{
                console.log(result);                                                                 
                },
                error =>{
                console.log(error);
            });
        }else{
            this.storage.set('entity', JSON.stringify(this.aytoSuggested));
        }
      });     
      this.nav.present(this.entitiesModal);  
    }

    forgottenPass() {
      let prompt = Alert.create({
        title: this.translate.instant("login.forgottenAlertTitle"),
        message: this.translate.instant("login.forgottenAlertMessage"),
        inputs: [
          {
            name: 'email',
            placeholder: this.translate.instant("login.forgottenAlertInputPlaceholder")
          },
        ],
        buttons: [
          {
            text: this.translate.instant("app.btnCancel"),//'Cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: this.translate.instant("login.forgottenAlertBtnReset"),//'Reset',
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
    
    getAyuntamientosPorDistancia(location, language, errEntityManually) {        
        if (location == undefined){
            location = {};
            location.lat = 0;
            location.lng = 0;
        }
        this.loginService.getAyuntamientosPorDistancia(location.lat, location.lng, language)
                            .subscribe(
                                (aytos) =>{
                                    if(errEntityManually){
                                        this.showAlert(this.translate.instant("login.suggestedAlertTitle"), this.translate.instant("login.suggestedAlertMessage"), this.translate.instant("app.btnAccept"));
                                        this.aytoSuggested.AyuntamientoID = -1;
                                        this.aytoSuggested.Nombre = "Choose a entity manually";
                                    }
                                    this.aytos = aytos;
                                    if (this.aytoSuggested.AyuntamientoID != -1){
                                        this.aytoSuggested = aytos[0];

                                        if(this.platform.is('ios') && useSQLiteOniOS){
                                            this.db.setKey('entity', JSON.stringify(this.aytoSuggested)).then((result) =>{
                                                console.log(result);                                                                 
                                                },
                                                error =>{
                                                console.log(error);
                                            });
                                        }else{
                                            this.storage.set('entity', JSON.stringify(this.aytoSuggested));
                                        }
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

                                        if(this.platform.is('ios') && useSQLiteOniOS){
                                            this.db.setKey('user', JSON.stringify(this.user)).then((result) =>{
                                                console.log(result);                                                                 
                                                },
                                                error =>{
                                                console.log(error);
                                            });
                                        }else{
                                            this.storage.set('user', JSON.stringify(this.user));
                                        }
                                    }else{
                                        //this.loginLoading = false;
                                        this.loadingComponent.dismiss();                               
                                        this.showAlert(this.translate.instant("app.oopsAlertTitle"), this.translate.instant("login.loginAlertMessage"), this.translate.instant("app.btnAccept"));
                                    }
                                },
                                error => {
                                    this.errorMessage = <any>error;
                                    this.loadingComponent.dismiss();
                                });
        }
        
    }
    
    loginFacebookUser() {
        Facebook.login(["email", "public_profile"]).then((result) => {
            console.log(result)

            var FacebookID = result.authResponse.userID;
            var AccessToken = result.authResponse.accessToken;
            
            Facebook.api('/me?fields=name,email', []).then((result) =>  {
                console.log('Good to see you, ' + result.name + '.');

                this.loginService.loginUserFacebook(result.email, this.aytoSuggested.AyuntamientoID, FacebookID, AccessToken)
                            .subscribe(
                                (user) =>{                                    
                                    this.user = user;
                                    this.user.AyuntamientoNombre = this.aytoSuggested.Nombre;                                 
                                    
                                    if (this.user.token != '' && this.user.token != null) {
                                        this.configData();        

                                        if(this.platform.is('ios') && useSQLiteOniOS){
                                            this.db.setKey('user', JSON.stringify(this.user)).then((result) =>{
                                                console.log(result);                                                                 
                                                },
                                                error =>{
                                                console.log(error);
                                            });
                                        }else{
                                            this.storage.set('user', JSON.stringify(this.user));
                                        }
                                    }else{
                                        //this.loginLoading = false;
                                        this.loadingComponent.dismiss();                               
                                        this.showAlert(this.translate.instant("app.oopsAlertTitle"), this.translate.instant("login.loginAlertMessage"), this.translate.instant("app.btnAccept"));
                                    }
                                },
                                error => {
                                    this.errorMessage = <any>error;
                                    this.loadingComponent.dismiss();
                                });
            });
        })
    }
    
    loginGooglePlusUser(){
         //window['plugins'].googleplus.login(
         this.window.plugins.googleplus.login(
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
            this.showAlert(this.translate.instant("login.validateEmptyAlertTitle"), this.translate.instant("login.validateEmptyAlertMessage"), this.translate.instant("app.btnAccept"));
            return false;
        }else if(this.aytoSuggested.AyuntamientoID == -1){
            this.showAlert(this.translate.instant("login.validateSuggestedAlertTitle"), this.translate.instant("login.validateSuggestedAlertMessage"), this.translate.instant("app.btnAccept"));
            return false;
        }else{
            return true;
        }
        
    }
    
    configData() {
        this.loginService.getTipologiaPorAyuntamiento(this.user.token)
            .subscribe(
                (data) =>{

                    if(this.platform.is('ios') && useSQLiteOniOS){
                        this.db.setKey('familias', JSON.stringify(data.Familias)).then((result) =>{
                            console.log(result);                                                                 
                            },
                            error =>{
                            console.log(error);
                        });
                        this.db.setKey('tiposElementos', JSON.stringify(data.Elementos)).then((result) =>{
                            console.log(result);                                                                 
                            },
                            error =>{
                            console.log(error);
                        });
                        this.db.setKey('tiposIncidencias', JSON.stringify(data.Familias)).then((result) =>{
                            console.log(result);                                                                 
                            },
                            error =>{
                            console.log(error);
                        });
                    }else{
                        this.storage.set('familias', JSON.stringify(data.Familias));
                        this.storage.set('tiposElementos', JSON.stringify(data.Elementos));
                        this.storage.set('tiposIncidencias', JSON.stringify(data.Incidencias));
                    }
                    
                    this.loginService.getEstadosPorAyuntamiento(this.user.token)
                        .subscribe(
                            (data) =>{

                                if(this.platform.is('ios') && useSQLiteOniOS){
                                   this.db.setKey('estados', JSON.stringify(data)).then((result) =>{
                                        console.log(result);                                                                 
                                        },
                                        error =>{
                                        console.log(error);
                                    }); 
                                }else{
                                    this.storage.set('estados', JSON.stringify(data));                                       
                                }
                                
                                this.loginService.getResponsablesPorAyuntamiento(this.user.token)
                                    .subscribe(
                                        (data) =>{

                                            if(this.platform.is('ios') && useSQLiteOniOS){
                                                this.db.setKey('responsables', JSON.stringify(data)).then((result) =>{
                                                    console.log(result);                                                                 
                                                    },
                                                    error =>{
                                                    console.log(error);
                                                });
                                            }else{
                                                this.storage.set('responsables', JSON.stringify(data));
                                            }
                                            
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
