import {Injectable} from '@angular/core';
import {urlGecorApi} from './../../../../app/appConfig';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Aviso} from './incidentInterface'; 
import 'rxjs/Rx';

@Injectable()
export class IncidentService {
    constructor (private http: Http) {}
    
    getMisIncidencias(ciudadanoID: number, token: string): Observable<Aviso> {
        
        let body = JSON.stringify({ token, ciudadanoID });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        
        return this.http.post(urlGecorApi + 'Incident/getMisIncidencias', body, options)
                        .map(res => <Aviso> res.json())
                        .catch(this.handleError)
                    
    }
    
    private handleError (error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
  }
}