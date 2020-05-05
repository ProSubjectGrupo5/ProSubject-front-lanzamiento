import { Component, OnInit, OnDestroy} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ForoService, RespuestaService } from 'src/app/services/services.index';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import {Client} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';



@Component({
  selector: 'app-foro',
  templateUrl: './foro.component.html',
  styleUrls: ['./foro.component.css']
})
export class ForoComponent implements OnInit, OnDestroy {

  form:FormGroup;

  foro:any = {
    titulo:'',
    fechaCreacion:''
  }

  espacioId:number;

  respuestas:any[] = [];

  private client:Client;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private foroService:ForoService,
    private respuestaService:RespuestaService,
    private fb:FormBuilder) { }

  ngOnInit() {
    this.inicializarFormulario();
    this.activatedRoute.paramMap.subscribe(paramas=>{
      this.espacioId = parseInt(paramas.get('id'), 10);
      if(paramas.has('id')){
        this.foroService.getForoPorEspacio(this.espacioId).subscribe(data=>{
          this.foro = data;
          this.respuesta.foro = this.foro;

          this.respuestaService.getRespuestasPorForo(this.foro.id).subscribe(data=>{
            this.respuestas = data;
            console.log(this.respuestas);

            this.client = new Client();
            this.client.webSocketFactory = ()=>{
              //"https://prosubject-backend-v3.herokuapp.com/ws"
              return new SockJS("https://prosubject-backend-lanzamiento.herokuapp.com/ws");
            }

            this.client.onConnect = (frame) => {
              console.log('Conectados: ' + this.client.connected + ' : ' + frame);

              this.client.subscribe('/chat/mensaje', e =>{

                let respuesta = JSON.parse(e.body);
                respuesta.creacionRespuesta = new Date(respuesta.creacionRespuesta);
                this.respuestas.push(respuesta);
                console.log(respuesta);
              });
            }
            //NOS CONECTAMOS
            this.client.activate();

          });
        });
      }

    });

  }

  ngOnDestroy(){
    //NOS DESCONECTAMOS
    this.client.deactivate();
  }


  inicializarFormulario(){
    this.form = this.fb.group({
      contenido: new FormControl(''),
    });

    //VALIDACIONES
    this.form.get('contenido').setValidators(Validators.required);

  }

  
  respuesta:any = {
    contenido: '',
    user: JSON.parse(localStorage.getItem('usuario')).userAccount,
    foro: {}
  }

  insertar(){
    if(this.form.valid){

      this.respuesta.contenido = this.form.get('contenido').value;

      this.respuestaService.insertarComentario(this.respuesta).subscribe(data=>{
        console.log(data);
        this.client.publish({destination: '/api/mensaje', body: JSON.stringify(data)});
        this.form.get('contenido').setValue('');

      });
    }
  }

  cancelar(){
    if(JSON.parse(localStorage.getItem('usuario')).userAccount.autoridad === 'ALUMNO'){
      this.router.navigateByUrl('/espacios-alumno');
    }else{
      this.router.navigateByUrl('/espacios-profesor');
    }
  }


  

}
