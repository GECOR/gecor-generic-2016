import {IonicApp, Modal, Platform, NavController, NavParams, Page, ViewController} from 'ionic-angular';

@Page({
  templateUrl: './build/pages/galleryModal/galleryModal.html'
})

export class GalleryModalPage {
  galleryOptions = {
    //initialSlide: 1,
    loop: false
  };
  images: any[];  
  constructor(public platform: Platform
    , public params: NavParams
    , public viewCtrl: ViewController) {      
      this.images = params.data.filter(item => item != undefined);;
      //this.images = this.images.filter(item => item != undefined);
  }

  dismiss() {
      this.viewCtrl.dismiss();  
  }
  
}