import { Page, ViewController, IonicApp, Events } from 'ionic-angular';
import { OnInit } from 'angular2/core';
import * as Rx from 'rxjs/Rx';
import { ChatService } from './services/chat';
import { Message } from './models/message';
import { User } from './models/user';

@Page({
  templateUrl: './build/pages/tabs/content/incidents/incDetail/chat/chat.html',
  providers:[ChatService]
})

export class ChatPage implements OnInit {
  msg: string;
  //msgs: Rx.Subject<Message[]> = new Rx.Subject<Message[]>();
  msgs: any;
  friend: User;
  me: User;
  content: any;
  el: any;
  constructor(public chat: ChatService,
              public viewController: ViewController,
              public app: IonicApp,
              public e: Events) {
    this.me = chat.me;
    this.msgs = [];
    this.e.subscribe('newMessage', (e) => {
      this.scrollTo();
    });
  }

  ngOnInit(): void {
    this.msg = '';

    this.chat.currentFriend
      .subscribe((user: User) => {
        this.friend = user;
        //this.msgs = this.chat.getCurrentMessages(this.friend);
      });
  }

  ngAfterViewInit(): void {
    this.content = this.app.getComponent('chat');
    this.el = this.content.elementRef.nativeElement;
  }

  scrollTo(): void {
    // can't get proper this.el.scrollHeight?
    this.content.scrollTo(0, 5000000, 200);
  }

  sendMessage(): void {
    /*let msg = new Message({
      isRead: false,
      sender: this.me,
      recipient: this.friend,
      msg: this.msg
    });*/

    let msg = new Message({
      msg: this.msg
    });

    this.msgs.push(msg);

    /*this.chat.sendMessage(msg).then((resp) => {
      this.msg = '';
    });*/
  }

  public close(): void {
    //this.modal.close();
    let data = {};
    this.viewController.dismiss(data);
  }
}
