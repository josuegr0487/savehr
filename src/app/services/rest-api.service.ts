import { Injectable } from '@angular/core';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';

const apiUrl = "http://192.168.100.47/SavehrPanamericano.NetEnvironment/rest"

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  constructor(private http: HTTP ) { }

  getSucursales(): Promise<HTTPResponse> {
    const url = `${apiUrl}/getSucursales`;
    this.http.setDataSerializer('json');  
    return this.http.post(url,{},{});
  }

  validateUsuario(data): Promise<HTTPResponse> {
    const url = `${apiUrl}/getUsuario`;
    let user = {
      vUsrCve: data.user,
      vUsrPsw: data.password
    };
    this.http.setDataSerializer('json');    
    return this.http.post(url,user,{});
  }

  getDataChart(data): Promise<HTTPResponse> {
    console.log(data);    
    const url = `${apiUrl}/getDataDisponibilidad`;
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

// import { Injectable } from '@angular/core';
// import { Observable, of, throwError } from 'rxjs';
// import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
// import { catchError, tap, map } from 'rxjs/operators';

// const httpOptions = {
//   headers: new HttpHeaders({'Content-Type': 'application/json'})
// };


// const apiUrl = "http://192.168.100.47/SavehrPanamericano.NetEnvironment/rest"

// @Injectable({
//   providedIn: 'root'
// })
// export class RestApiService {

//   constructor( private http: HttpClient ) { }

//   private handleError(error: HttpErrorResponse) {
//     if (error.error instanceof ErrorEvent) {
//       // A client-side or network error occurred. Handle it accordingly.
//       console.error('An error occurred:', error.error.message);
//     } else {
//       // The backend returned an unsuccessful response code.
//       // The response body may contain clues as to what went wrong,
//       console.error(
//         `Backend returned code ${error.status}, ` +
//         `body was: ${error.error}`);
//     }
//     // return an observable with a user-facing error message
//     return throwError('Something bad happened; please try again later.');
//   }
  
//   private extractData(res: Response) {
//     let body = res;
//     return body || { };
//   }

//   getSucursales(data): Observable<any> {
//     const url = `${apiUrl}/getSucursales`;
//     return this.http.post(url,{}, httpOptions)
//     // .pipe(
//     //   map(this.extractData),
//     //   catchError(this.handleError));
//   }


// }
