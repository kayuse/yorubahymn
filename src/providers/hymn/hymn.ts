import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { File } from '@ionic-native/file';
import { Http } from '@angular/http';

@Injectable()
export class HymnProvider {
    private static DB_NAME = 'hymn.db';
    private akopoLength = 0;
    private totalAkoposInserted = 0;
    public hymnPageSize = 30;
    constructor(
        protected httpClient: HttpClient,
        protected sqlite: SQLite, private file: File,
        protected http: Http) {

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
                let akopoRequest = this.http.get("./assets/db/akopo.json").subscribe(response => {
                    if(!response.ok){
                        let result = {
                            status : -1,
                            message : 'There was an error in initiating this app. Kindly contact admin'
                        }
                        reject(result);
                    }
                    let data = response.json();
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

                db.executeSql('SELECT * from hymns ORDER by number LIMIT ?,?', [offset, this.hymnPageSize]).then(data => {
                    resolve(data);
                }).catch(error => {
                    reject(error);
                })
            })
        })
    }
    getCollectionHymns(collection) {
        return new Promise<any>((resolve, reject) => {
            this.getDB().then((db: SQLiteObject) => {
                let statement = "SELECT * from hymns where number >= ? and number <= ?";
                console.log('from is from ' + collection.from)
                db.executeSql(statement, [collection.from, collection.to]).then(data => {
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
                    }).catch(error => {
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
    search(text): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.getDB().then((db: SQLiteObject) => {
                let query = "SELECT DISTINCT hymns.* from hymns JOIN verses ON " +
                    "hymns.id = verses.hymn_id WHERE hymns.number LIKE ? OR " +
                    "hymns.title LIKE ? OR hymns.chorus LIKE ? OR extra LIKE ? OR " +
                    "verses.content LIKE ? ORDER BY hymns.number ASC LIMIT 100";
                let likeText = "%" + text + "%"
                let params = [likeText, likeText, likeText, likeText, likeText];
                db.executeSql(query, params).then(data => {
                    resolve(data)
                }).catch(error => {
                    reject(error)
                })
                //db.executeSql()
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
                    "views int(11) DEFAULT 0 NOT NULL," +
                    "chorus TEXT)", []).then(data => {
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
        })

    }
    createHymnData() {
        return new Promise<any>((resolve, reject) => {
            let hymnPromise = this.http.get("./assets/db/hymns.json");
            hymnPromise.subscribe(response => {
                if (!response.ok) {
                    let error = {
                        'message': 'There was an issue in fetching the file'
                    }
                    reject(error)
                }
                let hymnData = response.json();
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
                            processedHymns++;
                            this.createVerseData(db, hymnData[i]['verses'], data).then(response => {
                                versesProcessed++;
                                if(versesProcessed >= hymnData.length){
                                    let response = {
                                        db: db,
                                        data: hymnData
                                    }
                                    resolve(response)
                                }else{
                                    console.log('Not done yet');
                                    console.log('hymn data' + hymnData.length +  ' verses data ' + versesProcessed)
                                }
                            });
                        }).catch(error => {
                            console.error('error', error);
                            console.error('issue with ' + hymnData[i]);
                            reject(error);
                        });
                    }
                  

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
                params.push(verses[i]['strippedContent']);
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