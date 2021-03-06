import {Injectable} from '@angular/core';
import {urlGecorApi} from './../../../../../appConfig';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class IncDetailService {
    constructor (private http: Http) {}
    
    addLike(token: string, avisoID: number): Observable<any> {
        
        let body = JSON.stringify({ token, avisoID });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        
        return this.http.post(urlGecorApi + 'Incident/addLike', body, options)
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