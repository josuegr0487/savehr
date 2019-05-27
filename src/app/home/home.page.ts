import { Component, ElementRef, ViewChild } from '@angular/core';
import { LoadingController } from '@ionic/angular';

import * as HighCharts from 'highcharts';
import * as moment from 'moment'
import { RestApiService } from '../services/rest-api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('container', { read: ElementRef }) private container: ElementRef;
  @ViewChild('graphic', { read: ElementRef }) private graphic: ElementRef;

  private chart: HighCharts.Chart;
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
    this.getSucursales();
  }

  ngAfterViewInit() {
    this.chart = HighCharts.chart(this.graphic.nativeElement, {
        chart: {
          type: 'spline'
        },
        title: {
          text: ''
        },
        xAxis: {
          categories: ['Apples', 'Bananas', 'Oranges']
        },
        yAxis: {
          title: {
            text: 'Porcentaje'
          }
        },
        series: <Array<Highcharts.SeriesOptionsType>>[
          {
            name: 'Jane',
            data: [1, 0, 4]
          },
          {
            name: 'John',
            data: [5, 7, 3]
          }
        ],
        credits: { enabled: false }
      });
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
      this.chart.update({
        xAxis: {
          categories: SDTDataChart.categories
        },
        series: SDTDataChart.series
    });
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