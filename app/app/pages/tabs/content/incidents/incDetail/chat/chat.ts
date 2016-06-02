import {ViewChild, OnInit, ElementRef} from '@angular/core';
import {NgClass} from '@angular/common';
import { Page, ViewController, IonicApp, Events, NavParams } from 'ionic-angular';;
import * as Rx from 'rxjs/Rx';
import { ChatService } from './services/chat';
import { Message } from './models/message';
import { User } from './models/user';
import { AuthService } from './services/auth';

@Page({
  templateUrl: './build/pages/tabs/content/incidents/incDetail/chat/chat.html',
  directives: [NgClass],
  providers:[ChatService, AuthService]
})

export class ChatPage implements OnInit {
  
  @ViewChild('chatContent') content;
  
  msg: string;
  me: User;
  incident: any;
  msgs: any;
  
  constructor(private chat: ChatService,
              private auth: AuthService,
              params: NavParams,
              private viewController: ViewController,
              private app: IonicApp,
              private e: Events) {
    this.e.subscribe('newMessage', (e) => {
      if(e[0].UsuarioID != this.me.CiudadanoID){
        this.msgs.push(e[0]);
        this.scrollTo();  
      }      
    });
    
    this.me = params.get('user');
    this.incident = params.get('incident');
    this.msgs = params.get('messages');
  }

  ngOnInit(): void {
    this.msg = '';
    this.auth.getToken({name: this.me.Nombre, id: this.me.CiudadanoID, avisoID: this.incident.AvisoID}).then((status) => {
      if (status) {
        this.chat.socketAuth();
      }
    });
    
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
        UsuarioID: this.me.CiudadanoID,
        AvisoID: this.incident.AvisoID,
        msg: this.msg
      });

      this.msgs.push(_msg);

      this.chat.sendMessage(_msg).then((resp) => {
        this.msg = '';
        this.scrollTo();
      });
    } 
       
  }

  public close(): void {
    this.chat.disconnectChat();
    let data = {};
    this.viewController.dismiss(data);
  }
}
