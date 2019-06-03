import { Component, OnInit, Input} from '@angular/core';
import * as Highcharts from 'highcharts';

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
  selector: 'app-output-graph',
  templateUrl: './output-graph.component.html',
  styleUrls: ['./output-graph.component.scss']
})
export class OutputGraphComponent implements OnInit {
  
  @Input() options:any = {};

  public chart: Highcharts.Chart;

  constructor( ) { }
  ngOnInit(){
    this.chart = Highcharts.chart('container', this.options);
  }

  ngOnChanges(){
    if(this.chart){
      let seriesLength = this.chart.series.length;    
      for (let index = seriesLength -1; index > -1; index--) {   
        this.chart.series[index].remove();
      } 
      seriesLength = this.options.series.length;
      for (let index = 0; index < seriesLength; index++) {
        this.chart.addSeries(this.options.series[index],false);
      }
      this.chart.update(this.options);
      this.chart.redraw();;
    }
  }

}