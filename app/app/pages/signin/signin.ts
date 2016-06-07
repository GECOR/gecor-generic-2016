import {Page, NavController, MenuController, Loading, Alert, NavParams, Modal} from 'ionic-angular';
import {forwardRef} from '@angular/core';
import {AndroidAttribute} from './../../directives/global.helpers';
import {LoginPage} from './../login/login';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {SignInService} from './signinService';
import {LegalTermsPage} from './legalTerms/legalTerms';

@Page({
    templateUrl: './build/pages/signin/signin.html',
    directives: [forwardRef(() => AndroidAttribute)],
    pipes: [TranslatePipe],
    providers: [SignInService]
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
  , private signinService: SignInService) {
    
    this.aytoSuggested = params.data;
    
    this.loadingComponent = Loading.create({
                content: 'Please wait...'
            });    
  }
  
  nuevoUsuario(){
    if (this.validateFields()){
      this.nav.present(this.loadingComponent);
      this.signinService.nuevoUsuario(this.nombre.trim(), this.email.trim(), this.password.trim(), this.aytoSuggested.AyuntamientoID,
      this.dispositivo, this.aplicacion, this.idioma, this.modeloMovil)
                  .subscribe(
                      (result) =>{                                    
                          this.loadingComponent.dismiss();
                          this.result = result[0];
                                                          
                          if (this.result.CiudadanoID > 0) {
                            
                          }else if(this.result.Error){
                            this.showAlert("Oops!", this.result.Error, "Accept");
                          }else{
                            this.showAlert("Oops!", "There is a problem with server, try again later", "Accept");
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
        this.showAlert("Data is empty", "Please enter an email and password", "Accept");
        return false;
    }else if(this.password != this.confirmPassword){
      this.showAlert("Oops!", "Passwords does not match", "Accept");
    }else if(!this.acceptLegalTerms){
      this.showAlert("Oops!", "Please accept legal terms", "Accept");
    }else{
        return true;
    }
        
  }
    
  showAlert(title, subTitle, okButton){
    let alert = Alert.create({
      title: title,
      subTitle: subTitle,
      buttons: [okButton]
    });
    this.nav.present(alert);
  }

  openLoginPage() {
    this.nav.push(LoginPage, {});
  }
  
  openLegalTerms() {
    if (this.acceptLegalTerms){
      this.legalTermsModal = Modal.create(LegalTermsPage, this.aytoSuggested);
      this.nav.present(this.legalTermsModal);
    }
  }
  
}
