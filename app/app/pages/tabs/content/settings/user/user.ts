import {NavController, NavParams, MenuController, ActionSheet, Storage, SqlStorage} from 'ionic-angular';
import {Page, ViewController, Platform} from 'ionic-angular';
import {forwardRef, NgZone} from 'angular2/core';
import {AndroidAttribute} from './../../../../../directives/global.helpers';
import {ConferenceData} from './../../../../../providers/conference-data';
import {SlidePage} from './../../../../slides/slide';

@Page({
  templateUrl: './build/pages/tabs/content/settings/user/user.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class UserPage {
  user: any = {};
  storage: any;
  rootPage: any;
  constructor(private platform: Platform
    , private menu: MenuController
    , private nav: NavController
    , private _ngZone: NgZone
    , private confData: ConferenceData ) {
        
        this.storage = new Storage(SqlStorage);

  }
  
  onPageWillEnter() {
    this.storage.get('user').then((user) => {
        this.user = JSON.parse(user);
    })
  }
  
  logout() {
      //this.storage.remove('user');
      //this.nav.popToRoot();
      //this.nav.setRoot(SlidePage);
      this.rootPage = SlidePage;
  }

  takePhoto() {
    let actionSheet = ActionSheet.create({
      title: '',
      buttons: [
        {
          text: 'Gallery',
          handler: () => {
            window.imagePicker.getPictures((results) => {
                    for (var i = 0; i < results.length; i++) {
                        console.log('Image URI: ' + results[i]);
                    }
                    this._ngZone.run(() => {
                      this.user.image = results[0];
                    });
                }, (error) => {
                    console.log('Error: ' + error);
                }
            );
          }
        },
        {
          text: 'Camera',
          handler: () => {
            Camera.getPicture().then((imageURI) => {
              this.user.image = imageURI;
            }, (message) => {
              alert('Failed because Camera!');
              console.log('Failed because: ');
              console.log(message);
            });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log("Cancel clicked");
          }
        }
      ]
    });

    this.nav.present(actionSheet);
  }

}
