import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private urlEndPoint: string = 'http://localhost:8080/api/login';

  usuarioLogueado:any;

  constructor(private http: HttpClient) { }



  login(username:string, password:string):Observable<any> {
    let url:string = `${this.urlEndPoint}?username=${username}&password=${password}`;
    return this.http.get(url).pipe(
      map(response => response as any),
      catchError(e =>{
        console.error(e.error.mensaje);
        swal.fire('Error al iniciar sesión.', `${e.error.mensaje}.`, 'error');
        return throwError(e);
      })
    );
  }

}