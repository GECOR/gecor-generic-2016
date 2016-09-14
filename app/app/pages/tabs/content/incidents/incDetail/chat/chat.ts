import {Component, ViewChild, OnInit} from '@angular/core';
import {NgClass} from '@angular/common';
import {TranslatePipe, TranslateService} from 'ng2-translate/ng2-translate';
import {ViewController, App, Events, NavParams, NavController, AlertController} from 'ionic-angular';;
import * as Rx from 'rxjs/Rx';
import { ChatNodeService } from './services/chat';
import { Message } from './models/message';
import { User } from './models/user';
import { AuthService } from './services/auth';
import { ChatService } from './chatService'
import {UtilsProvider} from './../../../../../../providers/utils';

@Component({
  templateUrl: './build/pages/tabs/content/incidents/incDetail/chat/chat.html',
  directives: [NgClass],
  providers:[ChatService, ChatNodeService, AuthService, UtilsProvider],
  pipes: [TranslatePipe]
})

export class ChatPage {
  
  @ViewChild('chatContent') content;
  
  msg: string;
  me: User;
  incident: any;
  msgs: any;  
  loadingComponent: any;
  errorMessage: any;

  tab:any;
  
  constructor(private chat: ChatNodeService,
              private auth: AuthService,
              private chatProvider: ChatService,
              params: NavParams,
              private nav: NavController,
              private viewController: ViewController,
              private app: App,
              private utils: UtilsProvider,
              private translate : TranslateService,
              private e: Events
              , public alertCtrl: AlertController) {

    this.msg = '';
    this.me = params.get('user');
    this.incident = params.get('incident');
    
    this.e.subscribe('newMessage', (e) => {
      if(e){
        if(e[0].UsuarioID != this.me.CiudadanoID){
          this.msgs.push(e[0]);
          this.scrollTo();  
        }
      }            
    });
    
      
    //this.msgs = params.get('messages');
  }

  ionViewDidEnter(){

    if(!this.chat.socketJoin(this.incident.AvisoID, this.me.token)){
      let alert = this.alertCtrl.create({
      title: this.translate.instant("incidents.pagechat.alertTitle"),
      message: this.translate.instant("incidents.pagechat.alertMessage"),
      buttons: [{
            text: this.translate.instant("app.btnAccept"),
            handler: data => {
              this.close();
            }
          }]
      });
      alert.present();
    }

    this.getMessages(this.me.token, this.incident.AvisoID); 
  }

  scrollTo(): void {
    let dimensions = this.content.getContentDimensions();
    this.content.scrollTo(0, dimensions.scrollBottom, 0);
  }

  sendMessage(): void {
    
    if(this.msg){
      let _msg = new Message({ 
        Nombre: this.me.Nombre,     
        UsuarioID: this.me.UsuarioID,
        AvisoID: this.incident.AvisoID,
        FechaHoraRegistro: new Date(),
        Mensaje: this.msg
      });

      this.msgs.push(_msg);

      this.chat.sendMessage(_msg).then((resp) => {
        this.msg = '';
        this.scrollTo();
      });
    }

    this.msg = '';
       
  }

  public close(): void {
    //this.chat.disconnectChat();//server V1
    this.chat.disconnectUserChat(this.incident.AvisoID);
    let data = {};
    this.viewController.dismiss(data);
  }
  
  getMessages(token: string, avisoID: number){
    this.loadingComponent = this.utils.getLoading(this.translate.instant("app.loadingMessage"));    
    this.loadingComponent.onDidDismiss((result) => {
      this.msgs = result;
      this.scrollTo(); 
    });
    
    let navTransition = this.loadingComponent.present();
    navTransition.then(() => { 
      this.chatProvider.getChatAviso(token, avisoID)
        .subscribe(
            (result) =>{
              this.loadingComponent.dismiss(result);                                           
            },
            error =>{
              this.errorMessage = <any>error;
              this.loadingComponent.dismiss();
            });
    });
  }
  
  setDate(date: string) {
    var n_date = new Date(date);
    var h = n_date.getHours();
    var m = n_date.getMinutes();
    var s_m = m.toString();
    if (m < 10){
      s_m = '0' + m;
    }
    return h + ':' + s_m;
  }
  
}
