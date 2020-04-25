import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BusquedaAsignaturaService } from 'src/app/services/busqueda-asignatura/busqueda-asignatura.service';
import { GradoService, CursoService, AsignaturaService, FacultadService, EspacioService, ProfesorService } from 'src/app/services/services.index';
import { validarHoras } from "./hour-validation";
import { validarFecha } from "./date-validation";
import { Router } from "@angular/router";
import { HorarioService } from 'src/app/services/horario/horario.service';

@Component({
  selector: 'app-creacion-espacio',
  templateUrl: './creacion-espacio.component.html',
  styleUrls: ['./creacion-espacio.component.css']
})
export class CreacionEspacioComponent implements OnInit {

  form:FormGroup;

  universidades: any[];
  facultades: any[];
  grados: any[];
  cursos: any[];
  asignaturas: any[];

  //---Creación de espacio---
  espacio: any = {
    asignatura:{},
    foro:{},
    profesor:{},
    precio:'',
    draftMode:''
  }
  asignatura: any = {}
  profesor: any = {}
  //---Creación de espacio---


  //---Creación de horarios---
  json: any[] = []
  horario:any = { 
    dia:'',
    horaInicio:'',
    horaFin:'',
    espacio:'',
    capacidad:'',
    fechaInicio:'',
  }
  //---Creación de horarios---

  diasSemana: any[] = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', "Sabado", "Domingo"]

  constructor(private fb: FormBuilder,
    private busquedaAsignaturaService: BusquedaAsignaturaService,
    private facultadService: FacultadService,
    private gradoService: GradoService,
    private cursoService: CursoService,
    private asignaturaService: AsignaturaService,
    private horarioService: HorarioService,
    private profesorService: ProfesorService,
    private router: Router) { }

  ngOnInit() {
    this.inicializarFormulario();

    this.busquedaAsignaturaService.getUniversidades().subscribe(data=>{
      this.universidades = data;

      /*
      this.cursoService.getCursos().subscribe(data=>{
        this.cursos = data;
      });
      */
    });
  }

  inicializarFormulario(){
    //CAMPOS DEL FORMULARIO Y VALIDACIONES
    this.form = this.fb.group({
      universidad: new FormControl('', Validators.required),
      facultades: new FormControl({value:null, disabled:true}, Validators.required),
      grado: new FormControl({value:null, disabled:true}, Validators.required),
      curso: new FormControl('', Validators.required),

      
      precio: new FormControl('', [Validators.required, Validators.min(0), Validators.max(30),Validators.pattern('^[0-9]{1,}(\\.[0-9]{1,2})?$')]),
      asignatura: new FormControl({value:null, disabled:true}, Validators.required),
     

      draftMode: new FormControl('', Validators.required),
      horarios: this.fb.array([
        this.fb.group({
          dia: new FormControl('', Validators.required),
          horaInicio: new FormControl('', [Validators.required, Validators.pattern('^([01]?[0-9]|2[0-3]):[0-5][0-9]$')]),
          horaFin: new FormControl('', [Validators.required, Validators.pattern('^([01]?[0-9]|2[0-3]):[0-5][0-9]$')]),
          capacidad: new FormControl('', [Validators.required, Validators.min(1), Validators.max(50), Validators.pattern("^[0-9]+$")]),
          fechaInicio: new FormControl('', [Validators.required, validarFecha]),      
        }, {validators: validarHoras})
      ])
    })

    
    //ESPERO CAMBIOS EN EL SELECT DE UNIVERSIDAD
    this.form.get('universidad').valueChanges.subscribe(data=>{

      if(data !== ''){
        this.facultadService.getFacultadesPorUniversidad(this.form.get('universidad').value).subscribe(res=>{
          if(res.length > 0){
            this.facultades = res;
            this.form.get('facultades').enable();
          }else{
            this.form.get('facultades').setValue('');
            this.form.get('facultades').disable();
            this.facultades = [];
          }
        });
      }else{
        this.form.get('facultades').setValue('');
        this.form.get('facultades').disable();
        this.facultades = [];
      }

    });


    //ESPERO CAMBIOS EN EL SELECT DE FACULTAD
    this.form.get('facultades').valueChanges.subscribe(data=>{

      if(data !== ''){
        this.gradoService.getGradosPorUniversidadYFacultad(this.form.get('universidad').value, this.form.get('facultades').value).subscribe(res=>{
          if(res.length > 0){
            this.grados = res;
            this.form.get('grado').enable();
          }else{
            this.form.get('grado').setValue('');
            this.form.get('grado').disable();
            this.grados = [];
          }
        });
      }else{
        this.form.get('grado').setValue('');
        this.form.get('grado').disable();
        this.grados = [];
      }


    });



    //ESPERO CAMBIOS EN EL SELECT DE GRADOS
    this.form.get('grado').valueChanges.subscribe(data=>{
      if(data !== null && data !== ''){
        this.cursoService.getCursosPorGrado(this.form.get('grado').value).subscribe(res=>{
          if(res.length > 0){
            this.cursos = res;
            this.form.get('curso').enable();
          }else{
            this.form.get('curso').setValue(null);
            this.form.get('curso').disable();
            this.cursos = [];
          }
        });
      }else{
        this.form.get('curso').setValue(null);
        this.form.get('curso').disable();
        this.cursos = [];
      }
    });


     //ESPERO CAMBIOS EN EL SELECT DE CURSO
     this.form.get('curso').valueChanges.subscribe(data=>{

      if(data !== ''){
        this.asignaturaService.getAsignaturasPorUniversidadYFacultadYGradoYCurso(this.form.get('universidad').value, this.form.get('facultades').value, this.form.get('grado').value, this.form.get('curso').value).subscribe(res=>{
          console.log(res);
          this.asignaturas = res;
          this.form.get('asignatura').setValue('');
          this.form.get('asignatura').enable();
          
        });
      }else{
        this.form.get('asignatura').setValue('');
        this.form.get('asignatura').disable();
        this.asignaturas = [];
        
      }


    });

  }

  get horarios(){
    return this.form.get('horarios') as FormArray;
  }

  addNuevoHorario(){
    this.horarios.push(this.fb.group({
      dia: new FormControl('', Validators.required),
      horaInicio: new FormControl('', [Validators.required, Validators.pattern('^([01]?[0-9]|2[0-3]):[0-5][0-9]$')]),
      horaFin: new FormControl('', [Validators.required, Validators.pattern('^([01]?[0-9]|2[0-3]):[0-5][0-9]$')]),
      capacidad: new FormControl('', [Validators.required, Validators.min(1), Validators.max(50), Validators.pattern("^[0-9]+$")]),
      fechaInicio: new FormControl('', [Validators.required, validarFecha])
    }, {validators: validarHoras}))
  }

  copiarHorario(index){
    const horario = this.horarios.value[index];
    this.horarios.insert(index, this.fb.group({
      dia: new FormControl(horario.dia, Validators.required),
      horaInicio: new FormControl(horario.horaInicio, [Validators.required, Validators.pattern('^([01]?[0-9]|2[0-3]):[0-5][0-9]$')]),
      horaFin: new FormControl(horario.horaFin, [Validators.required, Validators.pattern('^([01]?[0-9]|2[0-3]):[0-5][0-9]$')]),
      capacidad: new FormControl(horario.capacidad, [Validators.required, Validators.min(1), Validators.max(50), Validators.pattern("^[0-9]+$")]),
      fechaInicio: new FormControl(horario.fechaInicio, [Validators.required, validarFecha])
    }, {validators: validarHoras}))

    
  }

  deleteHorario(index){
    (<FormArray>this.form.get('horarios')).removeAt(index);
  }

  convertirHora(){
    const horario = this.form.get('horarios').value;

    horario.forEach(element => {
      const horaInicio = element.horaInicio.split(':');
      const horaFin = element.horaFin.split(':');
      
      let anyo=0;
      if(horaFin[0] == '00'){
        anyo = 1
      }

      element.horaInicio = new Date(2050,0,0,parseInt(horaInicio[0])+1, parseInt(horaInicio[1])).toISOString()
      element.horaFin = new Date(2050+anyo,0,0, parseInt(horaFin[0])+1, parseInt(horaFin[1])).toISOString()

    });
  }

  submit(){

    this.asignaturaService.getAsignaturaPorNombre(this.form.get('asignatura').value).subscribe(
      res => {
        this.asignatura = res;
        this.profesorService.getProfesorPorId(JSON.parse(localStorage.getItem('usuario')).id).subscribe(
          res => {
            this.profesor = res,
            this.espacio.precio = this.form.get('precio').value;
            this.espacio.asignatura = this.asignatura;
            this.espacio.profesor = this.profesor;
            this.espacio.draftMode = this.form.get('draftMode').value;

            this.convertirHora()
            this.form.get('horarios').value.forEach(element =>{
              this.horario.dia = element.dia;
              this.horario.horaInicio = element.horaInicio;
              this.horario.horaFin = element.horaFin;
              this.horario.espacio = this.espacio;
              this.horario.capacidad = element.capacidad;
              this.horario.fechaInicio = element.fechaInicio;
              
              this.json.push(this.horario)
              this.horario = { 
                dia:'',
                horaInicio:'',
                horaFin:'',
                espacio: '',
                capacidad:'',
                fechaInicio: ''
              }
              
            })
            console.log(this.json)
            this.horarioService.guardarHorario(this.json).subscribe(
              res => {
                console.log(this.json)
                if(this.json[0].espacio.draftMode == 0){
                  this.router.navigate(['espacios-profesor'])
                }else{
                  this.router.navigate(['espacios-editable-profesor'])
                }              
              },
              error => console.log(error)
            )
          },
          error => console.log(error)
        )
      },
      error => console.log(error),

    )
  }

}
