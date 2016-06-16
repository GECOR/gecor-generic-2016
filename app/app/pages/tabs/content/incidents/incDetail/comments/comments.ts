import {Component, forwardRef} from '@angular/core';
import {NavController, MenuController, Alert, Storage, SqlStorage, NavParams, Loading} from 'ionic-angular';
import {AndroidAttribute} from './../../../../../../directives/global.helpers';
import {CommentsService} from './commentsService';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {DBProvider} from './../../../../../../providers/db';

@Component({
  templateUrl: './build/pages/tabs/content/incidents/incDetail/comments/comments.html',
  directives: [forwardRef(() => AndroidAttribute)],
  providers: [CommentsService, DBProvider],
  pipes: [TranslatePipe]
})
export class CommentsPage {
  errorMessage: any;
  storage: any;
  user: any = {};
  incident: any;
  message: any;
  messages: any;
  loadingComponent: any;

  constructor(private nav: NavController
  , private menu: MenuController
  , private commentsService: CommentsService
  , private params: NavParams
  , private db: DBProvider) {
    
    this.incident = params.data;
    
    this.message = "";
    
    this.storage = new Storage(SqlStorage);
    /*this.storage.get('user').then((user) => {
        this.user = JSON.parse(user);
        this.nav.present(this.loadingComponent);
        this.getComentariosAviso();
    });*/

    db.getValue('user').then((user) => {
        this.user = JSON.parse(user.toString());
        this.nav.present(this.loadingComponent);
        this.getComentariosAviso();
    });
    
    this.loadingComponent = Loading.create({
                content: 'Please wait...'
            });
  }
    
    newComentarioAviso(message){
      if (this.message != ""){
        this.commentsService.newComentarioAviso(this.user.token, this.incident.AvisoID, message)
        .subscribe((result) =>{
          if (result[0].AvisoComentarioID > 0){
            this.message = "";
            this.messages.unshift(result[0]);
          }else{
            this.showAlert("Error", "There is some error", "OK");
          }
        },
        error =>{
          this.errorMessage = <any>error;
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
      let alert = Alert.create({
        title: title,
        subTitle: subTitle,
        buttons: [okButton]
      });
      this.nav.present(alert);
    }   
    
}
