import {Component, ViewChild, OnInit} from '@angular/core';
import {NgClass} from '@angular/common';
import {ViewController, App, Events, NavParams, Loading, NavController } from 'ionic-angular';;
import * as Rx from 'rxjs/Rx';
import { ChatNodeService } from './services/chat';
import { Message } from './models/message';
import { User } from './models/user';
import { AuthService } from './services/auth';
import { ChatService } from './chatService'

@Component({
  templateUrl: './build/pages/tabs/content/incidents/incDetail/chat/chat.html',
  directives: [NgClass],
  providers:[ChatService, ChatNodeService, AuthService]
})

export class ChatPage implements OnInit {
  
  @ViewChild('chatContent') content;
  
  msg: string;
  me: User;
  incident: any;
  msgs: any;  
  loadingComponent: any;
  errorMessage: any;
  
  constructor(private chat: ChatNodeService,
              private auth: AuthService,
              private chatProvider: ChatService,
              params: NavParams,
              private nav: NavController,
              private viewController: ViewController,
              private app: App,
              private e: Events) {
    
    this.e.subscribe('newMessage', (e) => {
      if(e){
        if(e[0].UsuarioID != this.me.CiudadanoID){
          this.msgs.push(e[0]);
          this.scrollTo();  
        }
      }            
    });
    
    this.loadingComponent = Loading.create({
                content: 'Please wait...'
            });
    
    this.me = params.get('user');
    this.incident = params.get('incident'); 
    
    this.getMessages(this.me.token, this.incident.AvisoID);   
    //this.msgs = params.get('messages');
  }

  ngOnInit(): void {
    this.msg = '';
    this.nav.present(this.loadingComponent);
    /* SERVER 1 required 
    this.auth.getToken({name: this.me.Nombre, id: this.me.UsuarioID, avisoID: this.incident.AvisoID}).then((status) => {
      if (status) {
        this.chat.socketAuth();
      }
    });
    */

    this.chat.socketJoin(this.incident.AvisoID, this.me.token);//seccond test with token
    //this.chat.socketJoin(this.me.token);//first test
  }

  ngAfterViewInit(): void {
    //this.content = this.app.getComponent('chat');
    //this.el = this.content.elementRef.nativeElement;
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
       
  }

  public close(): void {
    //this.chat.disconnectChat();//server V1
    this.chat.disconnectUserChat(this.incident.AvisoID);
    let data = {};
    this.viewController.dismiss(data);
  }
  
  getMessages(token: string, avisoID: number){
    this.chatProvider.getChatAviso(token, avisoID)
                            .subscribe(
                                (result) =>{
                                  this.loadingComponent.dismiss();
                                  
                                  this.msgs = result; 
                                  
                                  this.scrollTo();                                                                  
                                },
                                error =>{
                                  this.errorMessage = <any>error;
                                  this.loadingComponent.dismiss();
                                });
  }
  
  setDate(date: string) {
    return new Date(date);
  }
  
}
