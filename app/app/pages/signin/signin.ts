import {Component, forwardRef} from '@angular/core';
import {NavController, MenuController, AlertController, NavParams, ModalController} from 'ionic-angular';
import {AndroidAttribute} from './../../directives/global.helpers';
import {LoginPage} from './../login/login';
import {TranslatePipe, TranslateService} from 'ng2-translate/ng2-translate';
import {SignInService} from './signinService';
import {LegalTermsPage} from './legalTerms/legalTerms';
import {UtilsProvider} from './../../providers/utils';

@Component({
    templateUrl: './build/pages/signin/signin.html',
    directives: [forwardRef(() => AndroidAttribute)],
    pipes: [TranslatePipe],
    providers: [SignInService, UtilsProvider]
})
export class SignInPage {
  errorMessage: any;
  loadingComponent: any;
  
  aytoSuggested: any;
  
  nombre: string = "";
  email: string = "";
  password: string = "";
  confirmPassword: string = "";
  dispositivo: string = "";
  aplicacion: string = "C";
  idioma: string = "es";
  modeloMovil: string = "";
  acceptLegalTerms: boolean = false;
  
  legalTermsModal: any;
  
  result: any;

  constructor(private nav: NavController
  , private menu: MenuController
  , private params: NavParams
  , private utils: UtilsProvider
  , private translate : TranslateService
  , private signinService: SignInService
  , public modalCtrl: ModalController
  , public alertCtrl: AlertController) {
    
    this.aytoSuggested = params.data;
    this.loadingComponent = utils.getLoading(this.translate.instant("app.loadingMessage"));
  }
  
  nuevoUsuario(){
    if (this.validateFields()){
      this.loadingComponent.present();
      this.signinService.nuevoUsuario(this.nombre.trim(), this.email.trim(), this.password.trim(), this.aytoSuggested.AyuntamientoID,
      this.dispositivo, this.aplicacion, this.idioma, this.modeloMovil)
                  .subscribe(
                      (result) =>{                                    
                          this.loadingComponent.dismiss();
                          this.result = result[0];
                                                          
                          if (this.result.CiudadanoID > 0) {
                            let alert = this.alertCtrl.create({
                              title: this.translate.instant("signin.presentSignInSuccessTitle"),
                              message: this.translate.instant("signin.presentSignInSuccessMessage"),
                              buttons: [
                                {
                                  text: this.translate.instant("app.continueBtn"),
                                  role: 'cancel',
                                  handler: () => {
                                    alert.dismiss();
                                    this.openLoginPage();
                                  }
                                }
                              ]
                            });
                            alert.present();
                          }else if(this.result.Error){
                            this.showAlert(this.translate.instant("app.oopsAlertTitle"), this.result.Error, "Accept");
                          }else{
                            this.showAlert(this.translate.instant("app.oopsAlertTitle"), "There is a problem with server, try again later", "Accept");
                          }
                      },
                      error => {
                          this.errorMessage = <any>error;
                          this.loadingComponent.dismiss();
                      });
    }    
  }
  
  validateFields() {
    if (this.email == '' || this.password == '' || this.nombre == '') {
        this.showAlert(this.translate.instant("login.validateEmptyAlertTitle"), this.translate.instant("login.validateEmptyAlertMessage"), this.translate.instant("app.btnAccept"));
        return false;
    }else if(this.password != this.confirmPassword){
      this.showAlert(this.translate.instant("app.oopsAlertTitle"), this.translate.instant("signin.confirmPassAlertMessage"), this.translate.instant("app.btnAccept"));
    }else if(!this.acceptLegalTerms){
      this.showAlert(this.translate.instant("app.oopsAlertTitle"), this.translate.instant("signin.legalTermsAlertMessage"), this.translate.instant("app.btnAccept"));
    }else{
        return true;
    }
        
  }
    
  showAlert(title, subTitle, okButton){
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: [okButton]
    });
    alert.present();
  }

  openLoginPage() {
    this.nav.push(LoginPage, {});
  }
  
  openLegalTerms() {
    if (this.acceptLegalTerms){
      this.legalTermsModal = this.modalCtrl.create(LegalTermsPage, this.aytoSuggested);
      this.legalTermsModal.present();
    }
  }
  
}
