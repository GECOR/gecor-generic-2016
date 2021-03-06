import {Component, NgZone} from '@angular/core';
import {NavController, NavParams, MenuController, AlertController, ActionSheetController, 
        Platform, Events, ModalController} from 'ionic-angular';
import {ConferenceData} from './../../../../../../providers/conference-data';
import {Camera, ImagePicker} from 'ionic-native';
import {GeolocationProvider} from './../../../../../../providers/geolocation';
import {DBProvider} from './../../../../../../providers/db';
import {NewIncService} from './../../newIncService';
import {GalleryModalPage} from './../../../../../galleryModal/galleryModal';
import {TranslateService} from 'ng2-translate/ng2-translate';
import {UtilsProvider} from './../../../../../../providers/utils';
import {Step4Page} from './../step4/step4'
import {Storage} from '@ionic/storage';

@Component({
  selector: 'step3-page',
  templateUrl: 'step3.html',
  providers: [GeolocationProvider, NewIncService, UtilsProvider, DBProvider]
})
export class Step3Page {

  user: any = {};
  inc: any;
  images: any;
  uploadingImages: any;
  errorMessage: any;
  base64string = "data:image/jpeg;base64,";
  
  constructor(private platform: Platform
    , private menu: MenuController
    , private confData: ConferenceData
    , private nav: NavController
    , private _ngZone: NgZone
    , private geo: GeolocationProvider
    , private params: NavParams
    , private newIncService: NewIncService
    , private utils: UtilsProvider
    , private translate : TranslateService
    , private events: Events
    , private db: DBProvider
    , public modalCtrl: ModalController
    , public alertCtrl: AlertController
    , public actionSheetCtrl: ActionSheetController
    , public storage: Storage) {

        this.inc = params.data;
        !this.inc.imgs ? this.images = ["", "", "", ""] : this.images = this.inc.imgs;
        this.uploadingImages = [false, false, false, false];

        this.storage.get('user').then((user) => {
            this.user = JSON.parse(user);
        });
    
  }

  inputSearch(search) {
    console.log(search.value);
  }

  openGallery(){
    let galleryModal = this.modalCtrl.create(GalleryModalPage, this.images);      
    galleryModal.present(); 
  }

  takePhoto(id){
    let actionSheet = this.actionSheetCtrl.create({
      title: '',
      buttons: [
        {
          text: this.translate.instant("app.galleryText"),
          handler: () => {
              this.openImgPicker(id);
          }
        },
        {
          text: this.translate.instant("app.cameraText"),
          handler: () => {
              this.openCamera(id);
          }
        },
        {
          text: this.translate.instant("app.btnCancel"),
          role: 'cancel',
          handler: () => {
            console.log("Cancel clicked");
            this.uploadingImages[id] = false;
          }
        }
      ]
    });
    actionSheet.present();
  }

  uploadImage(imgBase64, id){
    if (imgBase64 != ""){
      this.newIncService.guardarFotoBase64(this.user.token, imgBase64)
      .subscribe((result) =>{
        if (result.rutaFoto){
          console.log(result);
          this._ngZone.run(() => {
            this.images[id] = result.rutaFoto;
          });
          this.uploadingImages[id] = false;
          this.inc.imgs = this.images;
        }else{
          this.showAlert(this.translate.instant("app.genericErrorAlertTitle"), this.translate.instant("newInc.presentConfirmErrorAlertMessage"), this.translate.instant("app.btnAccept"));
        }
      },
      error =>{
        this.errorMessage = <any>error;
      });
    }
  }

  showAlert(title, subTitle, okButton){
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: [okButton]
    });
    alert.present();
  }

  openCamera(id){
      if(id != -1){
          this.uploadingImages[id] = true;            
            Camera.getPicture({destinationType: Camera.DestinationType.DATA_URL, correctOrientation: true}).then((imageURI) => {
              this.utils.resizeImage(this.base64string + imageURI, 1024, 768).then((imgResized) => {
                this.uploadImage(imgResized, id);
              });
            }, (message) => {
              this.showAlert(this.translate.instant("app.genericErrorAlertTitle"), this.translate.instant("app.cameraErrorAlertMessage"), this.translate.instant("app.btnAccept"));
              console.log('Failed because: ' + message);
              this.uploadingImages[id] = false;
              console.log(message);
            });
      }else{
          this.showAlert(this.translate.instant("newInc.newIncStepByStep.step3.noMorePhotosTitle")
          , this.translate.instant("newInc.newIncStepByStep.step3.noMorePhotosSubtitle")
          , this.translate.instant("app.btnAccept"));
      }
      
  }

  openImgPicker(id){
    if(id != -1){
        this.uploadingImages[id] = true;
            ImagePicker.getPictures({maximumImagesCount: 1}).then((results) => {

                        if (results.length > 0){
                          this.utils.resizeImage(results[0], 1024, 768).then((imgResized) => {
                              this.uploadImage(imgResized, id);
                          });
                        }else{
                          this.uploadingImages[id] = false;
                        }                        
                        
                    }, (error) => {
                        console.log('Error: ' + error);
                        this.uploadingImages[id] = false;
                    }
                );
    }else{
        this.showAlert(this.translate.instant("newInc.newIncStepByStep.step3.noMorePhotosTitle")
        , this.translate.instant("newInc.newIncStepByStep.step3.noMorePhotosSubtitle")
        , this.translate.instant("app.btnAccept"));
    }
  }

  getIdPhoto(){
      if(this.images[0] == ""){
          return 0;
      }else if(this.images[1] == ""){
          return 1;
      }else if(this.images[2] == ""){
          return 2;
      }else if(this.images[3] == ""){
          return 3;
      }
      return -1;
  }

  openStep4(){
    this.inc.imgs = this.images;
    this.nav.push(Step4Page, this.inc);
  }

  openStep4WithoutPhoto(){
    this.nav.push(Step4Page, this.inc);
  }
  
}
