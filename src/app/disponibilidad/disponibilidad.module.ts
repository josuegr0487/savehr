import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { DisponibilidadPage } from './disponibilidad.page';
import { OutputGraphComponent } from '../output-graph/output-graph.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: DisponibilidadPage
      }
    ])
  ],
  declarations: [DisponibilidadPage,OutputGraphComponent]
})
export class DisponibilidadPageModule {}
