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
    public hymnPageSize = 30;
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
            })
                .then(data => {
                    return this.createHymnData();
                })
                .then(response => {
                    result.status = 1;
                    result.message = 'Successful'
                    resolve(result);
                }).catch(error => {
                    console.log('error');
                    result.status = -1;
                    result.message = 'There was an error in initiating this app. Kindly contact admin'
                    reject(result);
                });
        });
    }
    createAkopoList(data) {
        // this.getDB();
    }
    listAkopo(): Promise<any> {
        return new Promise((resolve, reject) => {
            let data = this.getDB().then((db: SQLiteObject) => {
                db.executeSql('SELECT * from akopos', []).then(data => {
                    resolve(data);
                }).catch(error => {
                    reject(error);
                })
            })

        })

    }
    getHymns(page): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.getDB().then((db: SQLiteObject) => {
                let offset = page * this.hymnPageSize;
               
                db.executeSql('SELECT * from hymns ORDER by number LIMIT ?,?', [offset,this.hymnPageSize]).then(data => {
                    resolve(data);
                }).catch(error => {
                    reject(error);
                })
            })
        })
    }
    getTotalHymn(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.getDB().then((db: SQLiteObject) => {
                db.executeSql('SELECT COUNT(*) as c from hymns', [])
                    .then(data => {
                        resolve(data);
                    }).catch(error =>{
                        reject(error);
                    })
            })
        })
    }
    getHymn(id): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.getDB().then((db: SQLiteObject) => {

            })
        })
    }
    getVerse(hymnId): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.getDB().then((db: SQLiteObject) => {
                let params = [hymnId];
                db.executeSql('SELECT * FROM verses where hymn_id = ?', params)
                    .then(data => {
                        resolve(data);
                    }).catch(error => {
                        reject(error);
                    })
            })
        })
    }
    createDB(): Promise<any> {
        console.log('create db called')
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

        }).then(response => {
            return new Promise<{ db: SQLiteObject, data: {} }>((resolve, reject) => {
                let db = response.db;
                db.executeSql("CREATE TABLE hymns (" +
                    "id INTEGER PRIMARY KEY AUTOINCREMENT," +
                    "title text  NOT NULL," +
                    "number int(11) NOT NULL," +
                    "extra TEXT NOT NULL," +
                    "chorus TEXT)", []).then(data => {
                        console.log('success in hymns')
                        let response = {
                            db: db,
                            data: data
                        }
                        resolve(response);
                    }).catch(error => {
                        console.log('error in hymns', error);
                        reject(error);
                    });

            })
        }).then(response => {
            return new Promise<{}>((resolve, reject) => {
                let db = response.db;
                db.executeSql("CREATE TABLE verses (" +
                    "id INTEGER PRIMARY KEY AUTOINCREMENT," +
                    "number int(11) NOT NULL," +
                    "hymn_id int(11) NOT NULL," +
                    "content TEXT)", []).then(data => {
                        console.log('success in verses')
                        resolve(data);
                    }).catch(error => {
                        console.log('error in verses', error);
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
                console.log('executing and populating table')
                db.executeSql(statement, params).then(data => {
                    let response = {
                        db: db,
                        data: data
                    }
                    console.log('succesfully populated the akopos table')
                    resolve(response)
                }).catch(error => {
                    console.error('error', error);
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
    createHymnData() {
        return new Promise<any>((resolve, reject) => {
            let hymnPromise = this.file.readAsText(this.file.applicationDirectory + "www/assets/db", "hymns.json");
            hymnPromise.then(response => {
                let hymnData = JSON.parse(response);
                console.log(hymnData);
                //let hym
                let rowArgs = [];
                let params = [];
                let processedHymns = 0;
                let versesProcessed = 0;
                this.getDB().then((db: SQLiteObject) => {
                    let statement = "INSERT INTO hymns(title,number,extra,chorus) VALUES(?,?,?,?)";
                    for (let i = 0; i < hymnData.length; i++) {
                        let dataParams = [
                            hymnData[i]['title'],
                            hymnData[i]['number'],
                            hymnData[i]['extra'],
                            hymnData[i]['chorus']
                        ];
                        db.executeSql(statement, dataParams).then(data => {
                            console.log('succesfully populated the hymn table' + i);
                            //console.log(data);
                            processedHymns++;
                            this.createVerseData(db, hymnData[i]['verses'], data).then(response => {
                                // console.log('Response for verses done');
                                versesProcessed++;

                            });
                        }).catch(error => {
                            console.error('error', error);
                            console.error('issue with ' + hymnData[i]);
                            reject(error);
                        });
                    }
                    let response = {
                        db: db,
                        data: hymnData
                    }


                    resolve(response)

                })
            })
        })
    }
    createVerseData(db: SQLiteObject, verses: Array<object>, data) {
        return new Promise<any>((resolve, reject) => {
            let statement = "INSERT INTO verses(number,hymn_id,content) VALUES";
            let rowArgs = [];
            let params = [];
            console.log('verse data for ' + verses[0]['hymn_id'])
            for (let i = 0; i < verses.length; i++) {
                rowArgs.push('(?,?,?)');
                params.push(verses[i]['number']);
                params.push(data.insertId);
                params.push(verses[i]['content']);
            }
            console.log(statement);
            statement += rowArgs.join(", ");
            db.executeSql(statement, params).then(data => {
                let response = {
                    db: db,
                    data: data
                }
                console.log('succesfully populated the verses table for ' + data)
                resolve(response);
            }).catch(error => {
                console.error('error', error);
                reject(error);
            });
        })

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