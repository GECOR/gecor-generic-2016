import {Injectable} from '@angular/core';
import {Loading} from 'ionic-angular';


@Injectable()
export class UtilsProvider {

  constructor() {}

  getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
        var dLon = this.deg2rad(lon2-lon1); 
        var a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2)
            ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        return d;
        }

    deg2rad(deg) {
        return deg * (Math.PI/180)
    }

    roundTwoDecimals(number){
        return Math.round(number * 100) / 100;
    }

    getLoading(title: string){
        return Loading.create({
            content: title
        });
    }

    /*getImageFromGallery_iOS(url){
        return new Promise((resolve, reject) => {
            var c=document.createElement('canvas');
            var ctx=c.getContext("2d");

            var img=new Image();
            img.src=url;
            img.onload = () => {
                c.width=img.width;
                c.height=img.height;
                ctx.drawImage(img,0,0);
                resolve(img);
            };
        });
    }*/

    /*resizeImage(img, width, heigth){
        return new Promise((resolve, reject) => {
            var c=document.createElement('canvas');
            var ctx=c.getContext("2d");

            var cw=c.width;
            var ch=c.height;

            var maxW=1024;
            var maxH=768;

            var nImg = new Image();
            nImg.src = img.src;

            nImg.onload = () => {
                var iw=nImg.width;
                var ih=nImg.height;

                var scale=Math.min((maxW/iw),(maxH/ih));

                var iwScaled=iw*scale;
                var ihScaled=ih*scale;

                c.width=iwScaled;
                c.height=ihScaled;

                ctx.drawImage(nImg,0,0,iwScaled,ihScaled);

                resolve(nImg);
            };
        });
    }*/

    resizeImage_iOS(imageUri, width, height){

        return new Promise((resolve, reject) => {
            var c=document.createElement('canvas');
            var ctx=c.getContext("2d");

            var cw=c.width;
            var ch=c.height;

            var maxW=width;
            var maxH=height;

            var img=new Image();
            img.src=imageUri;
            img.onload = () => {
                var iw=img.width;
                var ih=img.height;

                var scale=Math.min((maxW/iw),(maxH/ih));

                var iwScaled=iw*scale;
                var ihScaled=ih*scale;

                c.width=iwScaled;
                c.height=ihScaled;

                ctx.drawImage(img,0,0,iwScaled,ihScaled);

                resolve(c.toDataURL("image/jpeg", 0.3));
            };
        });
    }

    /*getBase64FromImage(img){
        var c=document.createElement('canvas');
        var ctx=c.getContext("2d");

        ctx.drawImage(img,0,0);
        return c.toDataURL("image/jpeg");
    }*/
}
