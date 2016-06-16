import {Injectable} from '@angular/core';
import {ionicBootstrap, Platform, Storage, SqlStorage} from 'ionic-angular';
import {SQLite} from 'ionic-native';


@Injectable()
export class DBProvider {

    storage: Storage;
    sqlite: SQLite;

    constructor(private platform: Platform) {
        this.storage = new Storage(SqlStorage);
    }

    initDB(){
        return new Promise((resolve, reject) => {
            //this.platform.ready().then(() => {
                /*this.storage.query('CREATE TABLE IF NOT EXISTS data (key TEXT PRIMARY KEY, value TEXT)').then((data) => {

                    this.storage.query("INSERT OR IGNORE INTO data (key, value) VALUES " + 
                                "('familias', '')," +
                                "('likes', '')," +
                                "('entity', '')," +
                                "('user', '')," +
                                "('tiposElementos', '')," +
                                "('tiposIncidencias', '')," +
                                "('estados', '')," +
                                "('responsables', '')," +
                                "('firstRun', '')," +
                                "('language', '');").then((data) => {

                        resolve(data);

                    }, (error) => {
                        //reject("ERROR -> " + error);
                        console.log(error);
                    });

                }, (error) => {
                    //reject("ERROR -> " + error);
                    console.log(error);
                });*/


                this.storage.query("INSERT OR IGNORE INTO kv (key, value) VALUES " + 
                                "('familias', '')," +
                                "('likes', '')," +
                                "('entity', '')," +
                                "('user', '')," +
                                "('tiposElementos', '')," +
                                "('tiposIncidencias', '')," +
                                "('estados', '')," +
                                "('responsables', '')," +
                                "('firstRun', '')," +
                                "('language', '');").then((data) => {

                        resolve(data);

                    }, (error) => {
                        //reject("ERROR -> " + error);
                        console.log(error);
                    });
            });
        //});*/
        
        
        
    }

    setKey(key, value){
        //console.log(this.getDB());
        return new Promise((resolve, reject) => {
            //this.platform.ready().then(() => {
                this.storage.query("UPDATE kv SET value = '" + value + "' WHERE key = '" + key + "'").then((data) => {
                    //console.log(JSON.stringify(data.res));
                    resolve(data.res);
                }, (error) => {
                    //console.log("ERROR -> " + JSON.stringify(error.err));
                    //reject("ERROR -> " + error);
                    console.log(error);
                });
            //});
        });
    }

    getValue(key){
        return new Promise((resolve, reject) => {
            //this.platform.ready().then(() => {
            this.storage.query("SELECT value FROM kv WHERE key = '" + key + "'").then((data) => {
                console.log("getValue -> " + data);
                    if (data.res.rows.length > 0){
                        if (data.res.rows.item(0).value != undefined){
                            resolve(data.res.rows.item(0).value);
                        }else{
                            resolve("");
                        }
                    }else{
                        resolve("");
                    }
                }, (error) => {
                    //reject("ERROR -> " + error);
                    console.log(error);
                });
            });
        //});
        
    }


}
