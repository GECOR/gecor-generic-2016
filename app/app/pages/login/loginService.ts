import {Injectable} from 'angular2/core';
import {urlGecorApi} from './../../appConfig';
import {Http, Response, Headers, RequestOptions} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {User} from './loginInterface'; 
import {Ayuntamiento} from './loginInterface'; 
import 'rxjs/Rx';

@Injectable()
export class LoginService {
    constructor (private http: Http) {}
    
    loginUser(Email: string, Password: string): Observable<User> {
        
        let body = JSON.stringify({ Email, Password });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        
        return this.http.post(urlGecorApi + '/User/loginUser', body, options)
                        .map(res => <User> res.json())
                        .do() // eyeball results in the console
                        .catch(this.handleError)
                    
    }
    
    getAyuntamientosPorDistancia(lat: string, lng: string): Observable<Ayuntamiento> {
        
        let body = JSON.stringify({ lat, lng });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        
        return this.http.post(urlGecorApi + '/Utils/getAyuntamientosPorCercania', body, options)
                        .map(res => <Ayuntamiento> res.json())
                        .do() // eyeball results in the console
                        .catch(this.handleError)
                    
    }
    
    private handleError (error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
  }
}