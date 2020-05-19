import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CarritoService } from 'src/app/services/carrito/carrito.service';
import { HorarioService } from 'src/app/services/horario/horario.service';
import { NgxSpinnerService } from "ngx-spinner";  
import { AlumnoService } from 'src/app/services/services.index';

declare var paypal;

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  perfil: any;
  carrito: any;
  error: string;

  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;
  
  constructor(private route: Router, private carritoService: CarritoService,
    private horarioService: HorarioService, private spinnerService: NgxSpinnerService,
    private alumnoService: AlumnoService) { }

  ngOnInit() {
    this.getPerfil();
    this.paypal();
  }

  private getPerfil() {
    if(JSON.parse(localStorage.getItem('usuario'))){
      this.alumnoService.getAlumnoPorId(JSON.parse(localStorage.getItem('usuario')).id).subscribe(
        res => {
          this.perfil = res;
          this.getCarrito(this.perfil.id)
        }
      );
    }else{
      this.route.navigate(['/inicio']);
    }
  }

  private getCarrito(idAlumno: string) {
    this.carritoService.getCarritoPorIdAlumno(idAlumno).subscribe(
      res => {
        this.carrito = res
        if(localStorage.getItem('carrito')){
          this.carritoService.addHorarioCarrito(this.carrito.id, localStorage.getItem('carrito'), idAlumno).subscribe(
            res => {
              localStorage.removeItem('carrito')
              this.getCarrito(idAlumno)
            },err => {
              localStorage.removeItem('carrito')
            })
        }
      },
      error =>{
        this.error = error.error.mensaje;
      })
  }

  eliminarHorario(idCarrito: string, idHorario: string){
    this.carritoService.deleteHorarioCarrito(idCarrito, idHorario, this.perfil.id).subscribe(
      res => {
        this.carrito = this.getCarrito(this.perfil.id);
        this.perfil = res.alumno;
      })
  }

  paypal(){
    paypal
      .Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                description: 'Comprando clases',
                amount: {
                  currency_code: 'EUR',
                  value: this.carrito.precioMensual
                }
              }
            ]
          });
        },
        onApprove: async (data, actions) => {
          this.spinnerService.show();
          const order = await actions.order.capture();
          var listHorariosId: number[] = [];
          this.carrito.horario.forEach(element => {
            listHorariosId.push(parseInt(element.id))
          });
          this.inscribirse(listHorariosId)
          console.log(order);
        },
        onError: err => {
          console.log(err);
        }
      })
      .render(document.getElementById('paypal'));

  }

  inscribirse(horariosId:any){
    if(!localStorage.getItem('usuario')){
      this.spinnerService.hide();
      this.route.navigateByUrl('/login');
    }else{
      this.horarioService.insertarAlumno(horariosId,JSON.parse(localStorage.getItem('usuario')).id).subscribe(data=>{
        this.getPerfil();
        this.spinnerService.hide();
        this.route.navigateByUrl('/espacios-alumno');
      }, err =>{
        this.spinnerService.hide();
      });
    }
  }

}
