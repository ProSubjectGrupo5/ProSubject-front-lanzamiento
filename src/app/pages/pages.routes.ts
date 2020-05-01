import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { BusquedaAsignaturaComponent } from './busqueda-asignatura/busqueda-asignatura.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CreacionEspacioComponent } from './creacion-espacio/creacion-espacio.component';
import { DetallesEspacioComponent } from './busqueda-asignatura/detalles-espacio/detalles-espacio.component';
import { EspaciosProfesorComponent } from './espacios-profesor/espacios-profesor.component';
import { EspaciosAlumnoComponent } from './espacios-alumno/espacios-alumno.component';
import { HorariosComponent } from './horarios/horarios.component';

import { RegistroComponent } from './registro/registro.component';

import { ProfesorGuard, AlumnoGuard, AdministradorGuard, AlumnoProfesorGuard, ProfesorExpedienteGuard, ValoracionProfesorGuard, ValoracionAlumnoGuard, AlumnoAnonimoGuard } from '../services/services.index';
import { NuevoAdminComponent } from './nuevo-admin/nuevo-admin.component';

import { EspaciosEditablesProfesorComponent } from './espacios-editables-profesor/espacios-editables-profesor.component';
import { VerHorariosComponent } from './espacios-editables-profesor/ver-horarios/ver-horarios.component';
import { EditarHorarioComponent } from './espacios-editables-profesor/ver-horarios/editar-horario/editar-horario.component';
import { CrearHorarioComponent } from './espacios-editables-profesor/ver-horarios/crear-horario/crear-horario.component';
import { EditarEspaciosComponent } from './espacios-editables-profesor/editar-espacios/editar-espacios.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ForoComponent } from './foro/foro.component';
import { CarritoComponent } from './carrito/carrito.component';
import { ValidarProfesorComponent } from './validar-profesor/validar-profesor.component';
import { PremiumComponent } from './premium/premium.component';
import { ValoracionesComponent } from './valoraciones/valoraciones.component';
import { CrearValoracionComponent } from './crear-valoracion/crear-valoracion.component';

import { NotificacionesComponent } from './notificaciones/notificaciones.component';

import { TycComponent } from './tyc/tyc.component';
import { PoliticaPrivacidadComponent } from './politica-privacidad/politica-privacidad.component';
import { UsuariosOlvidadosComponent } from './usuarios-olvidados/usuarios-olvidados.component';







const pagesRoutes: Routes = [
    {
        path: '',
        component: PagesComponent,
        children: [
            { path: 'busqueda-asignatura', component: BusquedaAsignaturaComponent, data:{titulo:'Búsqueda de espacios'}, canActivate: [AlumnoAnonimoGuard] },
            { path: 'inicio', component: HomeComponent, data:{titulo:'Inicio'} },
            { path:'login', component:LoginComponent, data:{titulo:'Inicio de sesión'}},
            { path:'registro', component:RegistroComponent, data:{titulo:'Registro'}},

            {path:'perfil', component: PerfilComponent, data:{titulo:'Perfil'}},
            {path:'carrito', component: CarritoComponent, data:{titulo:'Carrito'}, canActivate: [AlumnoGuard]},
            {path:'premium', component: PremiumComponent, data:{titulo:'Premium'}, canActivate: [ProfesorGuard]},

            //----CRISTIAN----
            {path:'creacion-espacio', component: CreacionEspacioComponent, data:{titulo:'Creación de espacio'}, canActivate: [ProfesorGuard]},
            {path:'detalles-espacio/:id', component: DetallesEspacioComponent, data:{titulo: 'Detalle del espacio'}, canActivate: [AlumnoAnonimoGuard]},
            {path:'espacios-profesor', component: EspaciosProfesorComponent, data:{titulo: 'Mis espacios'}, canActivate: [ProfesorExpedienteGuard]},
            {path:'espacios-editable-profesor', component: EspaciosEditablesProfesorComponent, data:{titulo: 'Espacios editables'}, canActivate: [ProfesorGuard]},
            {path:'ver-horarios/:id', component: VerHorariosComponent, data:{titulo: 'Horarios'}, canActivate: [ProfesorGuard]},
            {path:'editar-horario/:id', component: EditarHorarioComponent, data:{titulo: 'Editar horario'}, canActivate: [ProfesorGuard]},
            {path:'crear-horarios/:id', component: CrearHorarioComponent, data:{titulo: 'Crear horario'}, canActivate: [ProfesorGuard]},
            {path:'editar-espacio/:id', component: EditarEspaciosComponent, data:{titulo: 'Editar espacio'}, canActivate: [ProfesorGuard]},
            {path:'espacios-alumno', component: EspaciosAlumnoComponent, data:{titulo: 'Mis clases'}, canActivate: [AlumnoGuard]},
            {path:'horarios/:id', component: HorariosComponent, data: {titulo: 'Horarios'}, canActivate: [AlumnoAnonimoGuard]},
            {path:'nuevo-admin', component: NuevoAdminComponent, data: {titulo: 'Crear administrador'}, canActivate: [AdministradorGuard]},
            {path:'foro/:id', component: ForoComponent, data: {titulo: 'Foro'}, canActivate: [AlumnoProfesorGuard]},
            {path:'validar-profesor', component: ValidarProfesorComponent, data:{titulo: 'Validar profesor'}, canActivate: [AdministradorGuard]},
            {path:'valoraciones/:id', component: ValoracionesComponent, data: {titulo: 'Valoraciones'}, canActivate: [ValoracionProfesorGuard]},
            {path:'añadir-valoracion/:id', component: CrearValoracionComponent, data: {titulo: 'Valoraciones'}, canActivate: [AlumnoGuard, ValoracionAlumnoGuard]},

            {path:'notificaciones', component: NotificacionesComponent, data: {titulo: 'Notificaciones'}, canActivate: [AdministradorGuard]},

            {path:'terminos-y-condiciones', component: TycComponent, data: {titulo: 'Términos y condiciones'}},
            {path:'politica-privacidad', component: PoliticaPrivacidadComponent, data: {titulo: 'Política de privacidad'}},
            {path:'usuarios-olvidados', component: UsuariosOlvidadosComponent, data: {titulo: 'Usuarios a eliminar'}, canActivate: [AdministradorGuard]},


            { path: '', redirectTo: '/inicio', pathMatch: 'full' }
        ]
    }
];


export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
