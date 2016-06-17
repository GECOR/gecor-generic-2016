import {Component, forwardRef, NgZone} from '@angular/core';
import {ViewController, Platform, App, NavController, NavParams, MenuController, ActionSheet, Storage, SqlStorage} from 'ionic-angular';
import {Camera, ImagePicker} from 'ionic-native';
import {TranslatePipe, TranslateService} from 'ng2-translate/ng2-translate';
import {AndroidAttribute} from './../../../../../directives/global.helpers';
import {ConferenceData} from './../../../../../providers/conference-data';
import {SlidePage} from './../../../../slides/slide';
import {LoginPage} from './../../../../login/login';
import {DBProvider} from './../../../../../providers/db'
import {defaultLanguage, folderLanguage, sourceLanguage, compareLanguage, useSQLiteOniOS} from './../../../../../appConfig';

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
    , private translate : TranslateService
    , private confData: ConferenceData
    , private db: DBProvider) {
        
        this.storage = new Storage(SqlStorage);

  }
  
  ionViewWillEnter() {
    if(this.platform.is('ios') && useSQLiteOniOS){
      this.db.getValue('user').then((user) => {
          this.user = JSON.parse(user.toString());
      });
    }else{
      this.storage.get('user').then((user) => {
          this.user = JSON.parse(user);
      });
    }
  }
  
  logout() {
    if(this.platform.is('ios') && useSQLiteOniOS){
      this.db.setKey('user', '').then((result) =>{
          console.log(result);  
          let _nav = this.app.getRootNav();
          _nav.setRoot(LoginPage);                                                               
          },
          error =>{
          console.log(error);
      });
    }else{
      this.storage.remove('user').then((user) => {
        let _nav = this.app.getRootNav();
        _nav.setRoot(LoginPage);
      });
    }
  }

  takePhoto() {
    let actionSheet = ActionSheet.create({
      title: '',
      buttons: [
        {
          text: this.translate.instant("app.galleryText"),
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
          text: this.translate.instant("app.cameraText"),
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
          text: this.translate.instant("app.btnCancel"),
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
