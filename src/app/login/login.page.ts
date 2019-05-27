import { Component, OnInit } from '@angular/core';
import { NgForm }   from '@angular/forms';
import { Router } from  "@angular/router";
import { LoadingController } from '@ionic/angular';

import { RestApiService } from '../services/rest-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor( private  router:  Router, 
    private api: RestApiService,
    private loadingController: LoadingController ) { }

  ngOnInit() {
  }

  async login(form:NgForm){
    const loading = await this.loadingController.create({
      message: 'Validando acessos ...'
    });
    await loading.present(); 
    this.api.validateUsuario(form.value)
    .then(res => {        
      let resData = typeof res.data === 'string' ? JSON.parse(res.data):res.data;       
      let SDTUsuario = typeof resData.SDTUsuario == 'string' ? JSON.parse(resData.SDTUsuario.replace(/\\/g,'/')) : resData.SDTUsuario;
      if(SDTUsuario.error){
        alert(SDTUsuario.error);
        form.reset();
        loading.dismiss();
      }else{
        form.reset();
        loading.dismiss();
        this.router.navigateByUrl('home');
      }
  })
  .catch( err => {
      alert(err.error);
      form.reset();
      loading.dismiss();
    }
  );
  }

}