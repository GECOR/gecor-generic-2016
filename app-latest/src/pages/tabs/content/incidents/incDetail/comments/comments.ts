import {Component} from '@angular/core';
import {Platform, NavController, MenuController, AlertController, NavParams} from 'ionic-angular';
//import {AndroidAttribute} from './../../../../../../directives/global.helpers';
import {CommentsService} from './commentsService';
import {TranslateService} from 'ng2-translate/ng2-translate';
import {UtilsProvider} from './../../../../../../providers/utils';
import {DBProvider} from './../../../../../../providers/db';
import {useSQLiteOniOS} from './../../../../../../app/appConfig';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'comments-page',
  templateUrl: 'comments.html',
  //directives: [forwardRef(() => AndroidAttribute)],
  providers: [CommentsService, DBProvider, UtilsProvider],
  //pipes: [TranslatePipe]
})
export class CommentsPage {
  errorMessage: any;
  //storage: any;
  user: any = {};
  incident: any;
  message: any;
  messages: any;
  loadingComponent: any;
  sendingMsg: boolean = false;

  constructor(private nav: NavController
  , private menu: MenuController
  , private commentsService: CommentsService
  , private translate : TranslateService
  , private utils: UtilsProvider
  , private params: NavParams
  , private platform: Platform
  , private db: DBProvider
  , public alertCtrl: AlertController
  , public storage: Storage) {
    
    this.incident = params.data;
    
    this.message = "";

    this.loadingComponent = utils.getLoading(this.translate.instant("app.loadingMessage"));
    
     if(platform.is('ios') && useSQLiteOniOS){
        db.getValue('user').then((user) => {
            this.user = JSON.parse(user.toString());
            this.loadingComponent.present();
            this.getComentariosAviso();
        });     
      }else{
        //this.storage = new Storage(SqlStorage);
        this.storage.get('user').then((user) => {
            this.user = JSON.parse(user);
            this.loadingComponent.present();
            this.getComentariosAviso();
        });
      }
    
    
  }
    
    newComentarioAviso(message){
      if (this.message != ""){
        this.sendingMsg = true;
        this.loadingComponent = this.utils.getLoading(this.translate.instant("app.loadingMessage"));
        this.loadingComponent.present();
        this.commentsService.newComentarioAviso(this.user.token, this.incident.AvisoID, message)
        .subscribe((result) =>{
          this.sendingMsg = false;
          this.loadingComponent.dismiss();
          if (result[0].AvisoComentarioID > 0){
            this.message = "";
            this.messages.unshift(result[0]);
            this.incident.ComentariosAviso++;
            this.incident.UltimoComentario = message;
          }else{
            this.showAlert(this.translate.instant("app.genericErrorAlertTitle"), this.translate.instant("app.genericErrorAlertMessage"), this.translate.instant("app.btnAccept"));
          }
        },
        error =>{
          this.errorMessage = <any>error;
          this.loadingComponent.dismiss();
          this.sendingMsg = false;
        });  
      }               
    }
    
    getComentariosAviso() {
        this.commentsService.getComentariosAviso(this.user.token, this.incident.AvisoID)
                            .subscribe(
                                (result) =>{
                                  this.loadingComponent.dismiss();
                                  this.messages = result;                                                   
                                },
                                error =>{
                                  this.errorMessage = <any>error;
                                  this.loadingComponent.dismiss();
                                });
    }

    showAlert(title, subTitle, okButton){
      let alert = this.alertCtrl.create({
        title: title,
        subTitle: subTitle,
        buttons: [okButton]
      });
      alert.present();
    }   
    
}
