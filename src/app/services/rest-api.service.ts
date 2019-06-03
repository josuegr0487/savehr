import { Injectable } from '@angular/core';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import { TasksService } from "./tasks.service";

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  constructor(private http: HTTP, private tasks: TasksService ) { }

  async getSucursales(): Promise<HTTPResponse> {
    const apiUrl = await this.tasks.getParam('Host').then(result => result['valor']); 
    const url = `${apiUrl}/rest/getSucursales`;
    this.http.setDataSerializer('json');  
    return this.http.post(url,{},{});
  }

  async validateUsuario(data): Promise<HTTPResponse> {
    const apiUrl = await this.tasks.getParam('Host').then(result => result['valor']);  
    const url = `${apiUrl}/rest/getUsuario`;    
    let user = {
      vUsrCve: data.user,
      vUsrPsw: data.password
    }; 
    this.http.setDataSerializer('json');      
    return this.http.post(url,user,{});
  }

  async getDataChart(data): Promise<HTTPResponse> {
    const apiUrl = await this.tasks.getParam('Host').then(result => result['valor']);   
    const url = `${apiUrl}/rest/getDataDisponibilidad`;
    let chart = {
      vSeg_Usr_Ingreso: '',
      fechaInicial: data.initDate,
      fechaFinal:data.finalDate,
      tipo:1,
    };
    this.http.setDataSerializer('json');    
    return this.http.post(url,chart,{});
  }

}
