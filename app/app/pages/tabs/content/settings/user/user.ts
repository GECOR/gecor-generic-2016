import {Component, forwardRef, NgZone} from '@angular/core';
import {App, NavController, NavParams, MenuController, ActionSheet, Storage, SqlStorage} from 'ionic-angular';
import {ViewController, Platform} from 'ionic-angular';
import {Camera, ImagePicker} from 'ionic-native';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {AndroidAttribute} from './../../../../../directives/global.helpers';
import {ConferenceData} from './../../../../../providers/conference-data';
import {SlidePage} from './../../../../slides/slide';
import {LoginPage} from './../../../../login/login';
import {DBProvider} from './../../../../../providers/db'

@Component({
  templateUrl: './build/pages/tabs/content/settings/user/user.html',
  directives: [forwardRef(() => AndroidAttribute)],
  providers: [DBProvider],
  pipes: [TranslatePipe]
})
export class UserPage {
  user: any = {};
  storage: any;
  rootPage: any;
  constructor(private app: App 
    , private platform: Platform
    , private menu: MenuController
    , private nav: NavController
    , private _ngZone: NgZone
    , private confData: ConferenceData
    , private db: DBProvider) {
        
        this.storage = new Storage(SqlStorage);

  }
  
  ionViewWillEnter() {
    /*this.storage.get('user').then((user) => {
        this.user = JSON.parse(user);
    });*/
    this.db.getValue('user').then((user) => {
        this.user = JSON.parse(user.toString());
    });
  }
  
  logout() {
    /*this.storage.remove('user').then((user) => {
      let _nav = this.app.getRootNav();
      _nav.setRoot(LoginPage);
    });*/
    this.db.setKey('user', '').then((result) =>{
        console.log(result);  
        let _nav = this.app.getRootNav();
        _nav.setRoot(LoginPage);                                                               
        },
        error =>{
        console.log(error);
    });
  }

  takePhoto() {
    let actionSheet = ActionSheet.create({
      title: '',
      buttons: [
        {
          text: 'Gallery',
          handler: () => {
            ImagePicker.getPictures({maximumImagesCount: 1}).then((results) => {
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
            Camera.getPicture({quality: 50}).then((imageURI) => {
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
