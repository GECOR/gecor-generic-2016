import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
 
@Injectable()
export class IncidentsSort {
 
    constructor(public http: Http) {
 
    }
 
    transform(array: Array<string>, args: string, order:string, latLng: google.maps.LatLng): Array<string> {
        if (typeof args === "undefined") {
            return array;
        }
        if(args == "Distancia") {
            if (order == 'asc'){                
                array.sort((a: any, b: any) => {
                    var a_distance = this.getDistanceFromLatLonInKm(a["Lat"], a["Lng"], latLng.lat, latLng.lng).toString();
                    var b_distance = this.getDistanceFromLatLonInKm(b["Lat"], b["Lng"], latLng.lat, latLng.lng).toString();
                    if (b_distance > a_distance){
                        return 1;
                    }else{
                        return -1;
                    }
                }); 
            }else if(order == 'desc'){
                array.sort((a: any, b: any) => {
                    var a_distance = this.getDistanceFromLatLonInKm(a["Lat"], a["Lng"], latLng.lat, latLng.lng);
                    var b_distance = this.getDistanceFromLatLonInKm(b["Lat"], b["Lng"], latLng.lat, latLng.lng);
                    if (b_distance > a_distance){
                        return -1;
                    }else{
                        return 1;
                    }
                }); 
            }
        /*}else if(args == "TimeUpdated"){
            if (order == 'asc'){
                array.sort((a: any, b: any) => {
                    if (a[args] == undefined && b[args] == undefined){
                        return a["FechaHoraRegistro"].toString().localeCompare(b["FechaHoraRegistro"].toString());
                    }else if(a[args] == undefined){
                        return a["FechaHoraRegistro"].toString().localeCompare(b[args].toString());
                    }else if(b[args] == undefined){
                        return a[args].toString().localeCompare(b["FechaHoraRegistro"].toString());
                    }else{
                        return a[args].toString().localeCompare(b[args].toString());
                    }
                }); 
            }else if(order == 'desc'){
                array.sort((a: any, b: any) => {
                    if (a[args] == undefined && b[args] == undefined){
                        return b["FechaHoraRegistro"].toString().localeCompare(a["FechaHoraRegistro"].toString());
                    }else if(a[args] == undefined){
                        return b["FechaHoraRegistro"].toString().localeCompare(a[args].toString());
                    }else if(b[args] == undefined){
                        return b[args].toString().localeCompare(a["FechaHoraRegistro"].toString());
                    }else{
                        return b[args].toString().localeCompare(a[args].toString());
                    }
                }); 
            }*/
        } else {
            if (order == 'asc'){
                array.sort((a: any, b: any) => {
                    return a[args].toString().localeCompare(b[args].toString());
                }); 
            }else if(order == 'desc'){
                array.sort((a: any, b: any) => {
                    return b[args].toString().localeCompare(a[args].toString());
                }); 
            }
        }
        
        return array;
    }
    
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
 
}