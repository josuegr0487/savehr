import { Component, ElementRef, ViewChild } from '@angular/core';
import { LoadingController } from '@ionic/angular';

import * as moment from 'moment'
import { RestApiService } from '../services/rest-api.service';
import { async } from 'q';

@Component({
  selector: 'app-home',
  templateUrl: 'disponibilidad.page.html',
  styleUrls: ['disponibilidad.page.scss'],
})
export class DisponibilidadPage {
  @ViewChild('container', { read: ElementRef }) container: ElementRef;
  
  public data = {};
  public customDayNames = [ 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo' ];
  public customMonthNames = [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ];
  public form:any = {
    initDate : moment().format(),
    finalDate : moment().format(),
    sucursal: "",
    disponibilidad :"diaria"
  }
  public sucursales:any;

  constructor( public api: RestApiService, public loadingController: LoadingController ) {
  }

  ngOnInit(){
    //this.getSucursales();
  }


  ngAfterViewInit(){
    this.initChart();
  }


  async initChart(){    
    this.data = {
      chart: {
        type: 'spline'
      },
      title: {
        text: 'Fruit Consumption'
      },
      xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges']
      },
      yAxis: {
        title: {
          text: 'Porcentaje'
        }
      },
      series:[
        {
          name: 'Jane',
          data: [1, 0, 4]
        },
        {
          name: 'John',
          data: [5, 7, 3]
        }
      ],
      credits: { enabled: false },
      exporting: { showTable: true }
    };
  
  }

  async getSucursales() {
    const loading = await this.loadingController.create({
       message: 'Cargando Sucursales'
    });
    await loading.present();
    this.api.getSucursales()
      .then(res => {     
          let resData = typeof res.data === 'string' ? JSON.parse(res.data):res.data;       
          let SDTSucursales = typeof resData.SDTSucursales == 'string' ? JSON.parse(resData.SDTSucursales.replace(/\\/g,'/')) : resData.SDTSucursales;
          this.sucursales = SDTSucursales;
          loading.dismiss();
          console.log('SDTSucursales',SDTSucursales);
      })
      .catch( err => {
          console.log(err);
          loading.dismiss();
        }
      );
  }

  doRefresh(refresher: boolean, event?: any) {
    if (refresher) {
      setTimeout(() => {
        console.log('Async operation has ended');
        event.target.complete();
      }, 2000);
    } else {
      console.log('form',this.form); 
      this.getDataChart();
    }
  }

  getDataChart(){
    this.api.getDataChart(this.form)
    .then(res => {           
      let resData = typeof res.data === 'string' ? JSON.parse(res.data):res.data;       
      let SDTDataChart = typeof resData.SDTDataChart == 'string' ? JSON.parse(resData.SDTDataChart.replace(/\\/g,'/')) : resData.SDTDataChart;
      console.log('SDTDataChart',SDTDataChart);
      this.data = {
        xAxis: {
          categories: SDTDataChart.categories
        },
        series: SDTDataChart.series
    };
  })
  .catch( err => {
      console.log(err);
    }
  );

  }

  getFormat(){
    return this.form.disponibilidad == 'semanal' ? 'DD/MM/YYYY' : 'DD/MM/YYYY HH:mm';
  }

}