import { Events } from 'ionic-angular';
import { Injectable } from '@angular/core';
import * as Rx from 'rxjs/Rx';
import { User } from '../models/user';
import { Message } from '../models/message';
import {urlSocketServer} from './../../../../../../../app/appConfig';
import {DBProvider} from './../../../../../../../providers/db'
import {Storage} from '@ionic/storage';

declare var io;

@Injectable()
export class ChatNodeService {
  socket: any;
  me: any;
  usersStream: any = new Rx.Observable<User[]>();
  usersResponseStream: any;
  messagesStream: any = new Rx.Observable<Message[]>();
  messagesResponseStream: any;
  messages: any = new Rx.Subject<Message>();
  currentMessages: any = new Rx.Subject<Message[]>();
  createMessage: any = new Rx.Subject<Message>();
  friends: any = new Rx.Subject<User[]>();
  currentFriend: any = new Rx.BehaviorSubject<User>(null);
  n_message: any;
  n_user: any;

  constructor(public e: Events) { }

  private initUsersStreams(): void {
    this.usersStream = Rx.Observable.fromEvent(this.socket, 'onlineUsers');
    
    this.usersStream.subscribe((users) => {
      this.usersResponseStream = Rx.Observable.create((observer) => {
        observer.next(users);
      });

      this.usersResponseStream.subscribe((users: User[]) => {
        this.friends.next(users);
      });
    });
  }

  private initMessagesStreams(): void {
    this.messagesStream = Rx.Observable.fromEvent(this.socket, 'onMessage');
    
    this.messagesStream.subscribe((message: Message) => {
      this.messagesResponseStream = Rx.Observable.create((observer) => {
        observer.next(message);
      });

      this.messagesResponseStream.subscribe((message: Message) => {
        this.createMessage.next(message);
      });
    });

    this.createMessage.map((message: Message) => {
      return message;
    }).subscribe((message: Message) => {
      //this.e.publish('newMessage', true);
      this.e.publish('newMessage', message);
      //this.messages.next(message);
    });
  }

  public setCurrentFriend(user: User): void {
    this.currentFriend.next(new User(user));
  }

  public getCurrentMessages(user: User): Message[] {
    let msgs: Message[] = [];
    this.n_user = user;
    return this.messages.map((message: Message) => {
      this.n_message = message;
      if ((this.n_message.recipient.id === this.n_user .id &&
          this.n_message.sender.id === this.me.id) ||
          (this.n_message.recipient.id === this.me.id &&
           this.n_message.sender.id === this.n_user .id)) {
        msgs.push(new Message(message));
      }
      return msgs;
    });
  }

  public sendMessage(msg: Message): Promise<any> {
    return new Promise((resolve, reject) => {
      this.socket.emit('sendMessage', msg, (resp) => {
        if (resp.status) {
          this.addOwnMessage(msg);
          resolve();
        } else {
          reject();
        }
      });
    });
  }

  private addOwnMessage(msg: Message): void {
    this.createMessage.next(msg);
  }

/*
  private initLoggedInUser(): void {
    let profileData = JSON.parse(localStorage.getItem('profile'));
    if (!profileData) { return; }
    this.me = new User({
        id: profileData.id,
        name: profileData.name,
        avatar: profileData.avatar
    });
  }
  */

 private initLoggedInUser(): void {   
    let storage = new Storage();
    storage.get('user').then((user) => {
        //console.log(JSON.parse(user));
        this.me = JSON.parse(user);
    });
  }

  public socketAuth(): void {//SERVER 1    
    let token = localStorage.getItem('id_token');
    this.socket = io.connect(urlSocketServer);
    this.socket.on('connect', () => {
      this.socket.emit('authenticate', { token: token });
      this.initUsersStreams();
      this.initMessagesStreams();
      //this.initLoggedInUser();
    });
  }

   public socketJoin(idRoom, token): Boolean {//SERVER 2
     try {
       this.socket = io.connect(urlSocketServer);
     } catch (error) {
       console.error("Error SocketJoin",error)
     } finally{
       if(this.socket){
          this.socket.on('connect', () => {
          /*this.socket.on('authenticated', () => {
            //do other things
            //this.socket.emit('create', idRoom);
            console.log("authenticated");
          }).emit('authenticate', { token: idRoom });
          */
          this.socket.emit('create', idRoom);
          this.initUsersStreams();
          this.initMessagesStreams();
          //this.initLoggedInUser();
        });
        return true;
       }else{
        return false;
       }       
     }
  }
  
  public disconnectChat(): void {//SERVER 1
    if(this.socket)
      this.socket.emit('leave');      
  }

  public disconnectUserChat(idRoom): void {//SERVER 2
    if(this.socket)
      this.socket.emit('leave', idRoom);
      //this.socket.emit('disconnect');      
  }

}