import {Injectable} from '@angular/core';
import {urlGecorApi} from './../../../../../../app/appConfig';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class ReviewService {
    constructor (private http: Http) {}
    
    revisarIncidencia(token: string, avisoID: number, desSolucion: string, estadoAvisoID: number, origenIDResponsable: number, fotos: any[]): Observable<any> {
        
        let body = JSON.stringify({ token, avisoID, desSolucion, estadoAvisoID, origenIDResponsable, fotos });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        
        return this.http.post(urlGecorApi + 'Incident/revisarIncidencia', body, options)
                        .map(res => <any> res.json())
                        .catch(this.handleError)
                    
    }

    guardarFotoBase64(token: string, byteFoto: string): Observable<any> {
        
        let body = JSON.stringify({ token, byteFoto });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        
        return this.http.post(urlGecorApi + 'Incident/guardarFotoBase64', body, options)
                        .map(res => <any> res.json())
                        .catch(this.handleError);
                    
    }
    
    private handleError (error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}