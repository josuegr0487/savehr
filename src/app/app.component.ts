import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { TasksService } from "./services/tasks.service";
import { AlertOptions } from '@ionic/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Disponibilidad',
      url: '/disponibilidad',
      icon: 'home'
    },
    // {
    //   title: 'List',
    //   url: '/list',
    //   icon: 'list'
    // },
    // {
    //   title: 'Configuraci\u00F3n',
    //   url: '/config',
    //   icon: 'settings'
    // },
    {
      title: 'Cerrar Sesi\u00F3n',
      url: '/login',
      icon: 'close-circle'
    }
  ];

  private tables: Array<any>;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private tasks: TasksService
  ) {
     this.tables = [
      //crea nuevas tablas para esta app
      { query: 'CREATE TABLE IF NOT EXISTS config (id INTEGER PRIMARY KEY AUTOINCREMENT,parametro TEXT,valor TEXT,status NUMERIC)'}   
    ];
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      let ios = this.platform.is('ios');
      if(ios){
        this.statusBar.overlaysWebView(false);
      }
      this.statusBar.backgroundColorByHexString("#303F9E");
      this.createDatabase();
    });
  }

  private createDatabase(){
    this.tasks.createDatabase('savehr.db')
    .then(db => {
      this.tasks.setDatabase(db);
      let pendientTables:Array<any> = [];
      for (let item of this.tables) {  //recorre el array tables para crear cada una de las tablas de la base de datos   
        pendientTables.push(this.tasks.createTable(item.query));
      }    
      return Promise.all(pendientTables); //regresa todas las promesas 
    })
    .then(() => {
      this.splashScreen.hide();
      this.tasks.getParam('Host')
      .then(res => {
        if(!Object.keys(res).length){
          let alert:AlertOptions = {
            header: 'Host',
            message: 'Capture Host Genexus Savehr',
            inputs: [{
              name: 'host',
              type: 'text',
              value: 'http://192.168.100.47/SavehrPanamericano.NetEnvironment',
              placeholder: 'Capture Host Genexus Savehr'
            }],
            buttons: [{
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {             
                navigator['app'].exitApp();            
              }
            },
            {
              text: 'Aceptar',
              handler: data => {
                this.tasks.setParam('Host',data.host)
                .catch(e => {
                  navigator['app'].exitApp();   
                })
              }
            }]
          }
          this.tasks.presentAlert(alert);
        }
      })
    })
    .catch(err => {
      let alert:AlertOptions = {
        header: 'Error',
        message: err,
        buttons: ['OK']
      }
      this.tasks.presentAlert(alert);
    })
  }


}
