import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {UserData} from './user-data';;


@Injectable()
export class ConferenceData {
  data: any;

  constructor(private http: Http, private user: UserData) {}

  load() {
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
      this.http.get('data/data.json').subscribe(res => {
        // we've got back the raw data, now generate the core schedule data
        // and save the data for later reference
        this.data = this.processData(res.json());
        resolve(this.data);
      });
    });
  }

  processData(data) {
    // just some good 'ol JS fun with objects and arrays
    // build up the data by linking speakers to sessions

    return data;
  }

  getIncidents() {
    return this.load().then(data => {
      return data.incidents;
    });
  }

}
