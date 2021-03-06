import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HorarioService } from 'src/app/services/horario/horario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EspacioService } from 'src/app/services/services.index';
import { validarHoras } from "../../../creacion-espacio/hour-validation";
import { validarFecha } from"../../../creacion-espacio/date-validation";

@Component({
  selector: 'app-crear-horario',
  templateUrl: './crear-horario.component.html',
  styleUrls: ['./crear-horario.component.css']
})
export class CrearHorarioComponent implements OnInit {

  form: FormGroup;

  espacioId: number;

  horario:any = { 
    dia:'',
    horaInicio:'',
    horaFin:'',
    espacio:'',
    capacidad:'',
    fechaInicio: ''
  }

  diasSemana: any[] = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', "Sabado", "Domingo"]


  constructor(private fb: FormBuilder,
    private horarioService: HorarioService,
    private espacioService: EspacioService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {

    this.activatedRoute.paramMap.subscribe(paramas=>{
      this.espacioId = parseInt(paramas.get('id'), 10);
    })

    this.form = this.fb.group({
      dia: new FormControl('', Validators.required),
      horaInicio: new FormControl('', [Validators.required, Validators.pattern('^([01]?[0-9]|2[0-3]):[0-5][0-9]$')]),
      horaFin: new FormControl('', [Validators.required, Validators.pattern('^([01]?[0-9]|2[0-3]):[0-5][0-9]$')]),
      capacidad: new FormControl('', [Validators.required, Validators.min(1), Validators.max(50), Validators.pattern("^[0-9]+$")]),
      fechaInicio: new FormControl('', [Validators.required, validarFecha]),      
    }, {validators: validarHoras})
  }

  convertirFecha(){
      const horaInicio = this.form.get('horaInicio').value.split(':');
      const horaFin = this.form.get('horaFin').value.split(':');
      
      let anyo=0;
      if(horaFin[0] == '00'){
        anyo = 1
      }

      this.horario.horaInicio = new Date(2050,0,0,parseInt(horaInicio[0])+1, parseInt(horaInicio[1])).toISOString()
      this.horario.horaFin = new Date(2050+anyo,0,0, parseInt(horaFin[0])+1, parseInt(horaFin[1])).toISOString()

  }

  onSubmit(){
    
    this.horario.dia = this.form.get('dia').value;
    this.convertirFecha()
    this.horario.capacidad = this.form.get('capacidad').value;
    this.horario.fechaInicio = this.form.get('fechaInicio').value;
      
    this.espacioService.getEspaciosPorId(this.espacioId).subscribe(
      res => {
          this.horario.espacio = res;
          console.log(this.horario)

          this.horarioService.crearHorario(this.horario).subscribe(
            res => this.router.navigate(['ver-horarios', this.espacioId]),
            error => console.log(error)
          )

        },
        error => console.log(error)
      )



  }

  verHorarios(id){
    this.router.navigate(['ver-horarios', id])
  }

}
