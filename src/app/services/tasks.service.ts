import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { AlertOptions, LoadingOptions } from '@ionic/core';
import { AlertController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  db: SQLiteObject = null;

  constructor(
    private sqlite: SQLite, 
    private alert:AlertController, 
    private loading:LoadingController) { }

  //================================ Base de Datos ==============//
  //crea base de datos
  createDatabase(name:string){
    return this.sqlite.create({
      name: name,
      location: 'default'
    })
  }
  
  //selecciona la base de datos a utilizar
  setDatabase(db: SQLiteObject){
    if(this.db === null && db){
      this.db = db;
    }
  }

  //crea tabla en la base de datos del dispositivo
  createTable(query:string){
    let sql:string = query;
    return this.db.executeSql(sql, []);
  }

  //obtiene el valor del parametro selecionado
  getParam(parameter:string){
    let query = 'SELECT * FROM config WHERE parametro = ? AND status = 1';
    return this.db.executeSql(query,[parameter])
    .then(response => {
      let tasks:{} = {};
      if(response.rows.length){       
        tasks = (response.rows.item(response.rows.length -1));
      }
      return Promise.resolve( tasks );
    })
    .catch(error => Promise.reject(error));
  }

  //inserta parametro/valor en caso de no existir de lo contrario lo actualiza
  setParam(parameter:string,value:string){
    let query = 'SELECT * FROM config WHERE parametro = ? AND status = 1';
    return this.db.executeSql(query,[parameter])
      .then(res => { 
        let query = '';      
        if(res.rows.length){
          query = 'UPDATE config SET valor = ? WHERE parametro = ?';
          return this.db.executeSql(query,[value,parameter])              
        }else{
          query = 'INSERT INTO config(parametro,valor,status) VALUES(?,?,1)';
          return this.db.executeSql(query,[parameter,value])
        }
      })
      .catch(error => Promise.reject(error));  
  }

  async presentAlert(data:AlertOptions) {
    const element = await this.alert.getTop();  
    if (element) {
      element.dismiss();
    }
    const alert = await this.alert.create(data);
    return await alert.present();
  }

  async presentLoading(data:LoadingOptions){
    const element = await this.loading.getTop();
    if (element) {
      element.dismiss();
    }
    const loading = await this.loading.create(data);
    return loading;
  }

}
