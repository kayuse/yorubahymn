import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { File } from '@ionic-native/file';
import { resolveDefinition } from '@angular/core/src/view/util';

@Injectable()
export class HymnProvider {
    private static DB_NAME = 'hymn.db';
    private akopoLength = 0;
    private totalAkoposInserted = 0;
    constructor(
        protected httpClient: HttpClient,
        protected sqlite: SQLite, private file: File) {

    }

    loadHymns(): Promise<{ status, message }> {

        return new Promise((resolve, reject) => {
            // let akopoRequest = this.httpClient.get('../assets/db/akopo.json');
            let result = {
                status: 0,
                message: ''
            }

            let dbResult = this.createDB();
            dbResult.then(data => {
                let akopoRequest = this.file.readAsText(this.file.applicationDirectory + "www/assets/db", "akopo.json").then(response => {
                    let data = JSON.parse(response);
                    return this.createData(data);
                })
            }).then(response => {
                result.status = 1;
                result.message = 'Successful'
                resolve(result);
            }).catch(error => {
                result.status = -1;
                result.message = 'There was an error in initiating this app. Kindly contact admin'
                reject(result);
            });
        });
    }
    createAkopoList(data) {
        // this.getDB();
    }
    getAkopos(): Promise<any> {
        let data =  this.getDB().then((db: SQLiteObject) => {
                db.executeSql('SELECT * from akopos',[]).then(data => {
                    console.log(data);
                    return data;
                }).catch(error => {
                    return error;
                })
        })
        return data;
    }

    createDB(): Promise<any> {

        return this.sqlite.create({
            name: HymnProvider.DB_NAME,
            location: 'default',
        }).then((db: SQLiteObject) => {
            return new Promise<{ db: SQLiteObject, data: {} }>((resolve, reject) => {

                db.executeSql('create table akopos(id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(500), range VARCHAR(150), type VARCHAR(50))'
                    , []).then(data => {
                        let response = {
                            db: db,
                            data: data
                        }
                        console.log('success in akopos')
                        resolve(response);
                    }).catch(error => {
                        console.log('error in akopos', error)
                        reject(error);
                    });
            })


            /* db.executeSql("CREATE TABLE hymns (" +
                 "id INTEGER PRIMARY KEY AUTOINCREMENT," +
                 "title varchar(191)  NOT NULL," +
                 "number int(11) NOT NULL," +
                 "extra varchar(191) NOT NULL," +
                 "user_id int(11) NOT NULL," +
                 "chorus TEXT)", []).then(data => {
                     console.log('success for hymns', data);
                 }).catch(error => {
                  throw error;
                 });*/

        }).then(response => {
            return new Promise<{}>((resolve, reject) => {
                let db = response.db;
                db.executeSql("CREATE TABLE hymns (" +
                    "id INTEGER PRIMARY KEY AUTOINCREMENT," +
                    "title varchar(191)  NOT NULL," +
                    "number int(11) NOT NULL," +
                    "extra varchar(191) NOT NULL," +
                    "user_id int(11) NOT NULL," +
                    "chorus TEXT)", []).then(data => {
                        console.log('success in hymns')
                        resolve(data);
                    }).catch(error => {
                        console.log('error in hymns', error);
                        reject(error);
                    });

            })
        });
    }
    createData(akopoData: Array<Object>): Promise<any> {
        return new Promise<{ db: SQLiteObject, data: {} }>((resolve, reject) => {
            this.akopoLength = akopoData.length;
            this.getDB().then((db: SQLiteObject) => {
                let params = [];
                let statement = 'INSERT INTO akopos(title,range,type) VALUES';
                let rowArgs = [];
                for (let i = 0; i < akopoData.length; i++) {
                    rowArgs.push('(?,?,?)');
                    params.push(akopoData[i]['title']);
                    params.push(akopoData[i]['range']);
                    params.push(akopoData[i]['type']);
                    //let param = [akopoData[i]['title'], akopoData[i]['range'], akopoData[i]['type']];
                }

                statement += rowArgs.join(", ");

                db.executeSql(statement, params).then(data => {
                    let response = {
                        db: db,
                        data: data
                    }
                    resolve(response)
                }).catch(error => {
                    console.log('error', error);
                    reject(error);
                });

            });
        })/*.then(response => {
            return new Promise<{ db: SQLiteObject, data: {} }>((resolve, reject) => {
                let db = response.db;
                let responseResult = {
                    db: db,
                    data: 'Hymns'
                }
                resolve(response);

            })
        })*/


    }
    getDB() {
        return new Promise<SQLiteObject>((resolve, reject) => {
            this.sqlite.create({
                name: HymnProvider.DB_NAME,
                location: 'default'
            }).then((db: SQLiteObject) => {
                resolve(db);
            }).catch(error => {
                reject(error);
            })
        })
    }

}