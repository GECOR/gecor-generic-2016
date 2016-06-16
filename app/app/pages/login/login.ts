import {Component, forwardRef, NgZone} from '@angular/core';
import {NavController, MenuController, Alert, Storage, SqlStorage, Loading, Modal} from 'ionic-angular';
import {TranslateService, TranslateLoader, TranslateStaticLoader, TranslatePipe} from 'ng2-translate/ng2-translate';
import {AndroidAttribute} from './../../directives/global.helpers';
import {MainMenuContentPage} from './../main/main';
import {TabsPage} from './../tabs/tabs';
import {SignInPage} from './../signin/signin';
import {GeolocationProvider} from './../../providers/geolocation';
import {DBProvider} from './../../providers/db';
import {EntitiesPage} from './entities/entities';
import {LoginService} from './loginService';
import {User} from './loginInterface';
import {Facebook} from 'ionic-native';
import {EntitiesModalPage} from './entitiesModal/entitiesModal';
import {defaultLanguage, folderLanguage, sourceLanguage, compareLanguage} from './../../appConfig';
import {Globalization} from 'ionic-native';

@Component({
  templateUrl: './build/pages/login/login.html',
  directives: [forwardRef(() => AndroidAttribute)],
  providers: [GeolocationProvider, LoginService, DBProvider],
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
    
    constructor(private nav: NavController
      , private menu: MenuController
      , private geo: GeolocationProvider
      , private loginService: LoginService
      , private zone: NgZone
      , private translate: TranslateService
      , private db: DBProvider) {
        
        this.storage = new Storage(SqlStorage);
        
        /*this.storage.get('language').then((language) => {
            if (language == undefined){
                this.language = defaultLanguage;
            }else{
                this.language = language;
            }            
        })*/

        this.initDB();

        db.getValue('language').then((language) => {
            if (language == ""){
                this.language = defaultLanguage;
            }else{
                this.language = language.toString();
            }
        });
        
        this.loadingComponent = Loading.create({
            content: 'Please wait...'
        });
    }

    initDB(){
        this.db.initDB().then((result) =>{

            console.log(result);
                this.db.getValue('user').then((user) =>{
                if(user != ""){        
                    this.user = JSON.parse(user.toString());
                    this.nav.push(TabsPage);
                }

                /*this.db.getValue('firstRun').then((resp) => {
                    if(this.user)
                    this.rootPage = TabsPage;
                    else if(resp != "")
                    this.rootPage = LoginPage;
                    else
                    this.rootPage = SlidePage;
                }); */
            });

            Globalization.getPreferredLanguage().then((obj) =>{//get device language
                console.log(obj.value);
                this.initializeTranslateServiceConfig(obj.value.split('-')[0]);//initialize sending lowercase language
                //this.storage.set('language', obj.value.split('-')[0]);
                this.db.setKey('language', obj.value.split('-')[0]).then((result) =>{
                console.log(result);                                                                 
                },
                error =>{
                    console.log(error);
                });
            }, (err)=>{
                console.log(err); 
                this.initializeTranslateServiceConfig(defaultLanguage);//initialize sending lowercase language default 
                //this.storage.set('language', defaultLanguage);
                this.db.setKey('language', defaultLanguage).then((result) =>{
                console.log(result);                                                                 
                },
                error =>{
                    console.log(error);
                });
            });
            
        });
    }

    initializeTranslateServiceConfig(lang) {
        //var userLang = compareLanguage.test(lang) ? lang : defaultLanguage;     
        this.translate.setDefaultLang(defaultLanguage);   
        this.translate.use(compareLanguage.test(lang) ? lang : defaultLanguage);
    }
    
    ionViewWillEnter() {
        
    }
    
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
        //this.storage.set('entity', JSON.stringify(this.aytoSuggested));
        this.db.setKey('entity', JSON.stringify(this.aytoSuggested)).then((result) =>{
            console.log(result);                                                                 
            },
            error =>{
            console.log(error);
        });
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
                                        this.showAlert("Error", "We have problems to locate you, please choose a entity manually.", "OK");
                                        this.aytoSuggested.AyuntamientoID = -1;
                                        this.aytoSuggested.Nombre = "Choose a entity manually";
                                    }
                                    this.aytos = aytos;
                                    if (this.aytoSuggested.AyuntamientoID != -1){
                                        this.aytoSuggested = aytos[0];
                                        //this.storage.set('entity', JSON.stringify(this.aytoSuggested));
                                        this.db.setKey('entity', JSON.stringify(this.aytoSuggested)).then((result) =>{
                                            console.log(result);                                                                 
                                            },
                                            error =>{
                                            console.log(error);
                                        });
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
                                        //this.storage.set('user', JSON.stringify(this.user));
                                        this.db.setKey('user', JSON.stringify(this.user)).then((result) =>{
                                            console.log(result);                                                                 
                                            },
                                            error =>{
                                            console.log(error);
                                        });
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
                    //this.storage.set('familias', JSON.stringify(data.Familias));
                    //this.storage.set('tiposElementos', JSON.stringify(data.Elementos));
                    //this.storage.set('tiposIncidencias', JSON.stringify(data.Incidencias));
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
                    this.loginService.getEstadosPorAyuntamiento(this.user.token)
                        .subscribe(
                            (data) =>{
                                //this.storage.set('estados', JSON.stringify(data));
                                this.db.setKey('estados', JSON.stringify(data)).then((result) =>{
                                    console.log(result);                                                                 
                                    },
                                    error =>{
                                    console.log(error);
                                });
                                this.loginService.getResponsablesPorAyuntamiento(this.user.token)
                                    .subscribe(
                                        (data) =>{
                                            //this.storage.set('responsables', JSON.stringify(data));
                                            this.db.setKey('responsables', JSON.stringify(data)).then((result) =>{
                                                console.log(result);                                                                 
                                                },
                                                error =>{
                                                console.log(error);
                                            });
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
