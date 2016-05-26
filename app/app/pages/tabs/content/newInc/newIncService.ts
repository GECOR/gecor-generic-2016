import {Injectable} from '@angular/core';
import {urlGecorApi} from './../../../../appConfig';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class NewIncService {
    constructor (private http: Http) {}
    
    nuevaIncidencia(token: string, tipoElementoID: number, tipoIncID: number, desAveria: string, 
    x: number, y: number, calleID: number, nomCalle: number, numCalle: number, desUbicacion: string,
    edificioID: number, estadoAvisoID: number, tipoProcedenciaID: number, fotos: any[]): Observable<any> {
        
        let body = JSON.stringify({ token, tipoElementoID, tipoIncID, desAveria, x, y, calleID, nomCalle, numCalle,
            desUbicacion, edificioID, estadoAvisoID, tipoProcedenciaID, fotos });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        
        return this.http.post(urlGecorApi + 'Incident/nuevaIncidencia', body, options)
                        .map(res => <any> res.json())
                        .do() // eyeball results in the console
                        .catch(this.handleError);
                    
    }
    
    private handleError (error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}