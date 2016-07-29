import {Injectable} from '@angular/core';
import {urlGecorApi} from './../../appConfig';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {User} from './loginInterface'; 
import {Ayuntamiento} from './loginInterface'; 
import 'rxjs/Rx';

@Injectable()
export class LoginService {
    constructor (private http: Http) {}
    
    loginUser(Email: string, Password: string, AyuntamientoID: number): Observable<any> {
        
        let body = JSON.stringify({ Email, Password, AyuntamientoID });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        
        return this.http.post(urlGecorApi + 'User/loginUser', body, options)
                        .map(res => <any> res.json())
                        .catch(this.handleError)
                    
    }

    loginUserExternal(Email: string, AyuntamientoID: number, FacebookID: string, FacebookAccessToken: string, Nombre: string, 
    Dispositivo: string, Aplicacion: string, Idioma: string, ModeloMovil: string, GoogleID: string, UrlImage: string): Observable<any> {
        
        let body = JSON.stringify({ Email, AyuntamientoID, FacebookID, FacebookAccessToken, Nombre, Dispositivo, Aplicacion, 
            Idioma, ModeloMovil, GoogleID, UrlImage });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        
        return this.http.post(urlGecorApi + 'User/loginUserExternal', body, options)
                        .map(res => <any> res.json())
                        .catch(this.handleError)
                    
    }
    
    getAyuntamientosPorDistancia(lat: string, lng: string, language: string): Observable<Ayuntamiento> {
        
        let body = JSON.stringify({ lat, lng, language });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        
        return this.http.post(urlGecorApi + 'Utils/getAyuntamientosPorCercania', body, options)
                        .map(res => <Ayuntamiento> res.json())
                        .catch(this.handleError)
                    
    }
    
    getTipologiaPorAyuntamiento(token: string): Observable<any> {
        
        let body = JSON.stringify({ token });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        
        return this.http.post(urlGecorApi + 'Typology/getTipologiaPorAyuntamiento', body, options)
                        .map(res => <any> res.json())
                        .catch(this.handleError)
                    
    }
    
    getEstadosPorAyuntamiento(token: string): Observable<any> {
        
        let body = JSON.stringify({ token });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        
        return this.http.post(urlGecorApi + 'Utils/getEstadosPorAyuntamiento', body, options)
                        .map(res => <any> res.json())
                        .catch(this.handleError)
                    
    }
    
    getResponsablesPorAyuntamiento(token: string): Observable<any> {
        
        let body = JSON.stringify({ token });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        
        return this.http.post(urlGecorApi + 'Utils/getResponsablesPorAyuntamiento', body, options)
                        .map(res => <any> res.json())
                        .catch(this.handleError)
                    
    }

    restaurarPass(Email: string, AyuntamientoID: string, Idioma: string): Observable<any> {
        
        let body = JSON.stringify({ Email, AyuntamientoID, Idioma });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        
        return this.http.post(urlGecorApi + 'User/restaurarPass', body, options)
                        .map(res => <any> res.json())
                        .catch(this.handleError)
                    
    }
    
    private handleError (error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
  }
}