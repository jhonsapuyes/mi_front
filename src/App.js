




import './App.css';

import axios from "axios"
import "bootstrap/dist/css/bootstrap.min.css"
import {Fontawesome, FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEdit, faedit, faTrashAlt, faTrasHAlt} from '@fortawesome/free-solid-svg-icons'
import {Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import {Component} from 'react'


import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout";
import Logo from "./components/logo";
import NoPage from "./components/nopage";

 
const url= "http://localhost:9000/api/usuarios"

const url_deportes= "http://localhost:9000/api/deportes"
const url_equipos= "http://localhost:9000/api/equipos"

const url_events= "http://localhost:9000/api/marcadores"
const field_id_events= 'mar_id'


class App extends Component {

  state = {
    modal_insertar: false,
    tipo_modal: '',
    modal_dep: false,
    modal_equi: false,
    data: [], 
    data_2: [], 
    data_3: [], 
    data_deporte:[],
    data_equipo:[],
    data_usuario:[],
    form : {
      usu_email:'',
      usu_clave:'',
      usu_nombre:''
    },
    form_deportes: {
      dep_nombre:''
    },
    form_equipos: {
      equi_nombre:'',
      dep_id:''
    },
    form_events: {
      mar_id:'',
      mar_fecha_event:'',
      mar_fecha_registro:'',
      mar_hora_event:'',
      mar_hora_registro:'',
      equi_id_1: "",
      equi_id_2: "",
      mar_equi_1: "",
      mar_equi_2: "",
      mar_dep_id: "",
      mar_usu_id: ""
    },
    form_search: {
      mar_dep_id: "football"
    },
    auth: "",
    logueado: false,
    usuario_n:""
  }

  
  modal_insertar = () =>{  // esta f va en page eventos
    this.setState({modal_insertar: !this.state.modal_insertar})
  }
  modal_deporte = () =>{   // esta f va en page eventos
    this.setState({modal_dep: !this.state.modal_dep})
    this.setState({form_deportes: ""})
  }
  modal_equipo = () =>{    // esta f va en page eventos
    this.setState({modal_equi: !this.state.modal_equi})
    this.setState({form_equipos: ""})
  }

  peticion_get= ()=>{ // esta en peticion_put, peticion_post_events, componentDidMount
    axios.get(url_events).then(response=>{
      //console.log(response.data)
      this.setState({data:response.data}) //pone la data del response en array
    })
    .catch(error => {
      console.log(error.message)
    }
    )
  }
  peticion_get_multi_p= (pt_1)=>{ // esta en busqueda_p_p, componentDidMount
    if(pt_1 != ""){
      axios.get(url_events+"/"+pt_1+"/p").then(response=>{
        //console.log(response.data)
        this.setState({data_2:response.data}) //pone la data del response en array
      })
      .catch(error => {
        console.log(error.message)
      }
      )
    }
    else{
      alert("ELIGE UN DEPORTE")
    }
  }
  busqueda_p_p=()=>{ // esta en principal
    delete this.state.form_events.equi_id_1
    delete this.state.form_events.equi_id_2
    delete this.state.form_events.mar_equi_1
    delete this.state.form_events.mar_equi_2
    delete this.state.form_events.mar_fecha_event
    delete this.state.form_events.mar_fecha_registro
    delete this.state.form_events.mar_id
    delete this.state.form_events.mar_usu_id

    this.setState({form_search: this.state.form_events.mar_dep_id == ''? this.state.form_search: this.state.form_events })

    this.peticion_get_multi_p(this.state.form_events.mar_dep_id)

  }
  peticion_get_multi_e= (pt_1)=>{ // esta en busqueda_p_e, componentDidMount
    if(pt_1 != ""){
      axios.get(url_events+"/"+pt_1+"/e").then(response=>{
        //console.log(response.data)
        this.setState({data_3:response.data}) //pone la data del response en array
      })
      .catch(error => {
        console.log(error.message)
      }
      )
    }
    else{
      alert("ELIGE UN DEPORTE")
    }
  }
    busqueda_p_e=()=>{ //esta en events
    delete this.state.form_events.equi_id_1
    delete this.state.form_events.equi_id_2
    delete this.state.form_events.mar_equi_1
    delete this.state.form_events.mar_equi_2
    delete this.state.form_events.mar_fecha_event
    delete this.state.form_events.mar_fecha_registro
    delete this.state.form_events.mar_id
    delete this.state.form_events.mar_usu_id

    this.setState({form_search: this.state.form_events.mar_dep_id == ''? this.state.form_search: this.state.form_events })

    this.peticion_get_multi_e(this.state.form_events.mar_dep_id)

  }

  peticion_post= async () =>{ //esta en registers
    if(this.state.form){
      if(this.state.form.usu_email != "" && this.state.form.usu_email != undefined){
        if(this.state.form.usu_clave != "" && this.state.form.usu_clave != undefined){
          if(this.state.form.usu_nombre != "" && this.state.form.usu_nombre != undefined){
            //delete this.state.form.id

            await axios.post(url, this.state.form).then((response) =>{
              //  redirige a eventos
              //this.peticion_get()
              this.setState({form:''})
              //window.location.href="http://localhost:3000/events";  
              this.peticion_login()      
            })
            .catch(error => {
              console.log(error.message)
            }
            )
          }
          else{
            this.setState({form:''})
            alert("NOMBRE OBLIGATORIO")
          }
        }
        else{
          this.setState({form:''})
          alert("PASSWORD OBLIGATORIO")
        }
      }
      else{
        this.setState({form:''})
        alert("EMAIL OBLIGATORIO")
      }
    }
    else{alert("RELLENA TODOS LOS CAMPOS")}
  }

  peticion_put= async () =>{ //esta en render modal_insertar
      const id= this.state.form_events.mar_id
      delete this.state.form_events.mar_id
      await axios.put(url_events+'/'+field_id_events+'/'+id, this.state.form_events)
      .then((response) =>{
        this.modal_insertar()
        this.peticion_get()
        this.setState({form_events:''})
      })
      .catch(error => {
        console.log(error.message)
      }
      )
  }

  peticion_get_usuarios= ()=>{ // esta en componentDidMount
    axios.get(url).then(response=>{
      this.setState({data_usuario:response.data}) //pone la data del response en array
    })
    .catch(error => {
      console.log(error.message)
    }
    )
  }
  peticion_login= async () =>{ // esta en peticion_post, login

    delete this.state.form.usu_email

    if(this.state.form){
      if(this.state.form.usu_nombre != ''  && this.state.form.usu_nombre != undefined){
        if(this.state.form.usu_clave != ''  && this.state.form.usu_clave != undefined){
          await axios.get(url+'/'+this.state.form.usu_nombre+'/'+this.state.form.usu_clave)
          .then((response) =>{
            if(response.data[0].respuesta == "not results"){
              //console.log(response.data[0].respuesta)
              this.setState({form:''})
              alert("DATOS INGRESADOS ERRONEOS")
            }
            else{
              //console.log(response.data[0].usu_nombre)
              //this.setState({usuario_id: response.data[0].usu_nombre})
              this.setState({logueado: true})
              window.localStorage.setItem("tipo", true)
              window.localStorage.setItem("registro", response.data[0].usu_nombre)
            }
          })
          .catch(error => {
            console.log(error.message)
          }
          )
        }
        else{
          this.setState({form:''})
          alert("PASSWORD OBLIGATORIO")
        }
      }
      else{
        this.setState({form:''})
        alert("NOMBRE OBLIGATORIO")
      }
    }
    else{alert("RELLENA TODOS LOS CAMPOS")}
  }

  peticion_get_deportes= ()=>{ // esta en peticion_post_deportes, componentDidMount
    axios.get(url_deportes).then(response=>{
      //console.log(response.data)
      this.setState({data_deporte:response.data}) //pone la data del response en array
    })
    .catch(error => {
      console.log(error.message)
    }
    )
  }
  peticion_post_deportes= async () =>{ // esta en render modal_dep
    //alert(this.state.form_events)
    if(this.state.form_deportes.dep_nombre != "" && this.state.form_deportes.dep_nombre != undefined){
      await axios.post(url_deportes, this.state.form_deportes).then((response) =>{
        this.peticion_get_deportes()
        this.setState({form_deportes:''})
        this.modal_deporte()
      })
      .catch(error => {
        console.log(error.message)
      })
    }
    else{
      this.setState({form_deportes:''})
      alert("DEPORTE OBLIGATORIO")
    }
    
  }
  peticion_get_equipos= ()=>{ // esta en peticion_post_equipo, componentDidMount
    axios.get(url_equipos).then(response=>{
      //console.log(response.data)
      this.setState({data_equipo:response.data}) //pone la data del response en array
    })
    .catch(error => {
      console.log(error.message)
    }
    )
  }
  peticion_post_equipo= async () =>{ // // esta en render modal_equi
    //alert(this.state.form_events)
    if(this.state.form_equipos.equi_nombre != "" && this.state.form_equipos.equi_nombre != undefined){
      if(this.state.form_equipos.dep_id != "" && this.state.form_equipos.dep_id != undefined){
        await axios.post(url_equipos, this.state.form_equipos).then((response) =>{
          this.peticion_get_equipos()
          this.setState({form_equipos:''})
          this.modal_equipo()
        })
        .catch(error => {
          console.log(error.message)
        })
      }
      else{
        this.setState({form_equipos:''})
        alert("DEPORTE OBLIGATORIO")
      }
    }
    else{
      this.setState({form_equipos:''})
      alert("NOMBRE OBLIGATORIO")
    }
  }
  peticion_post_events= async () =>{ // esta en render modal_insertar
    //console.log(this.state.form_events)

    if(this.state.form_events.mar_fecha_event != "" && this.state.form_events.mar_fecha_event != undefined){
      if(this.state.form_events.mar_fecha_registro != "" && this.state.form_events.mar_fecha_registro != undefined){
        if(this.state.form_events.mar_hora_event != "" && this.state.form_events.mar_hora_event != undefined){ 
          if(this.state.form_events.mar_hora_registro != "" && this.state.form_events.mar_hora_registro != undefined){ 
            if(this.state.form_events.equi_id_1 != "" && this.state.form_events.equi_id_1 != undefined){
              if(this.state.form_events.equi_id_2 != "" && this.state.form_events.equi_id_2 != undefined){
                if(this.state.form_events.mar_equi_1 != "" && this.state.form_events.mar_equi_1 != undefined){
                  if(this.state.form_events.mar_equi_2 != "" && this.state.form_events.mar_equi_2 != undefined){
                    if(this.state.form_events.mar_dep_id != "" && this.state.form_events.mar_dep_id != undefined){
                      if(this.state.form_events.mar_usu_id != "" && this.state.form_events.mar_usu_id != undefined){
                        await axios.post(url_events, this.state.form_events).then((response) =>{
                          this.peticion_get()
                          this.setState({form_events:''})
                          this.modal_insertar()
                        })
                        .catch(error => {
                          console.log(error.message)
                        })
                      }
                      else{
                        this.setState({form_events:''})
                        alert("NOMBRE USUARIO OBLIGATORIO")
                      }
                    }
                    else{
                      this.setState({form_events:''})
                      alert("NOMBRE DEPORTE OBLIGATORIO")
                    }
                  }
                  else{
                    this.setState({form_events:''})
                    alert("MARCADOR EQUIPO VISITANTE OBLIGATORIO")
                  }
                }
                else{
                  this.setState({form_events:''})
                  alert("MARCADOR EQUIPO LOCAL OBLIGATORIO")
                }
              }
              else{
                this.setState({form_events:''})
                alert("EQUIPO VISITANTE OBLIGATORIO")
              }
            }
            else{
              this.setState({form_events:''})
              alert("EQUIPO LOCAL OBLIGATORIO")
            }
          }
          else{
            this.setState({form_events:''})
            alert("HORA REGISTRO OBLIGATORIO")
          }
        }
        else{
          this.setState({form_events:''})
          alert("HORA EVENTO OBLIGATORIO")
        }
      }
      else{
        this.setState({form_events:''})
        alert("FECHA REGISTRO OBLIGATORIO")
      }
    }  
    else{
      this.setState({form_events:''})
      alert("FECHA EVENTO OBLIGATORIO")
    }  
  }

  //////////////////////

  // principal la pueden mover para diseñarla con css o bootstrap
  principal= ()=>{ //esta en render(routes)
    const style_css_prueba = {
      background: "white" 
      
    } 
    return(  
      <div style={style_css_prueba}>
        {/*console.log(this.state.data)*/}
        {Logo}
        {Layout}


        <div>
          <select name="mar_dep_id" onChange={this.handle_change}>
            <option value="">ELIGE UN DEPORTE</option>
            {this.state.data_deporte.map(evento =>{ 
              return (
              <option value={evento.dep_nombre}>{evento.dep_nombre}</option>
              )
            })}
          </select>
          <button className='btn btn-success' onClick={() => this.busqueda_p_p()}>BUSCAR</button>
        </div>

        <table className='table'>
          <tbody>
            {this.state.data_2.map(evento =>{ // pide la data de la peticion_get para mapear
              return (
                <tr>
                  <td>{evento.equi_id_1}</td>
                  <td>{evento.mar_equi_1}</td>
                  <td>{evento.equi_id_2}</td>
                  <td>{evento.mar_equi_2}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
  // registers la pueden mover para diseñarla con css o bootstrap
  registers= ()=>{ //esta en render(routes) 
    const style_css_prueba = {
      background: "white"
    } 
    return(
      <div style={style_css_prueba}>
        {Logo}
        {Layout}
        <div>
        <label htmlFor='usu_email'>EMAIL</label>
          <input className='form-control' type="text" name='usu_email' id='usu_email' onChange={this.handle_change} value={this.state.form ? this.state.form.usu_email : ''} ></input>

          <label htmlFor='usu_clave'>PASSWORD</label>
          <input className='form-control' type="text" name='usu_clave' id='usu_clave' onChange={this.handle_change} value={this.state.form ? this.state.form.usu_clave : ''} ></input> 
          
          <label htmlFor='usu_nombre'>NOMBRE</label>
          <input className='form-control' type="text" name='usu_nombre' id='usu_nombre' onChange={this.handle_change} value={this.state.form ? this.state.form.usu_nombre : ''} ></input> 
           
          <button className='btn btn-success' onClick={() => this.peticion_post()}>REGISTER</button>
        </div>
        <h1>registrate</h1>

      </div>
    )
  }

  rdtc_l= ()=>{ // esta en login
    window.location.href="http://localhost:3000/deportescolombia/events"; 
  }
  // login la pueden mover para diseñarla con css o bootstrap
  login= ()=>{ //esta en render(routes) 
    const style_css_prueba = {
      background: "white"
    } 
    return(  
      <div style={style_css_prueba}>
        {Logo}
        {Layout}
        <div>

          <label htmlFor='usu_nombre'>NOMBRE</label>
          <input className='form-control' type="text" name='usu_nombre' id='usu_nombre' onChange={this.handle_change} value={this.state.form ? this.state.form.usu_nombre : ''} ></input> 
          
          <label htmlFor='usu_clave'>PASSWORD</label>
          <input className='form-control' type="text" name='usu_clave' id='usu_clave' onChange={this.handle_change} value={this.state.form ? this.state.form.usu_clave : ''} ></input> 

          <button className='btn btn-success' onClick={() => this.peticion_login()}>LOGIN</button>

        </div>
        <h1>logeate</h1>
      </div>
    )
  }

  close_sesion=()=>{ // esta en events
    this.setState({auth: ""})
    window.localStorage.setItem("tipo", "")
    window.localStorage.setItem("registro", "")
  }
  // events la pueden mover para diseñarla con css o bootstrap
  events= ()=>{ //esta en render(routes)

    const style_css_hidden = {
      display: "none"
    }

    const style_css_prueba = {
      background: "white"
    }

    return(
      <div style={style_css_prueba}>  
        {Logo}      
        <div>
          <button className='btn btn-success' onClick={() => this.close_sesion()}>CLOSE</button>
        </div>
        
        <button className='btn btn-success' onClick={() => {this.setState({form:null, tipo_modal:'insertar'}); this.modal_insertar()}}>REGISTRAR EVENTO</button> 
        <button className='btn btn-success' onClick={() => {this.setState({form:null, tipo_modal:'deporte'}); this.modal_deporte()}}>REGISTRAR DEPORTE</button> 
        <button className='btn btn-success' onClick={() => {this.setState({form:null, tipo_modal:'equipo'}); this.modal_equipo()}}>REGISTRAR EQUIPO</button> 

        <div>
          <select name="mar_dep_id" onChange={this.handle_change}>
            <option value="">ELIGE UN DEPORTE</option>
            {this.state.data_deporte.map(evento =>{ 
              return (
              <option value={evento.dep_nombre}>{evento.dep_nombre}</option>
              )
            })}
          </select>
          <button className='btn btn-success' onClick={() => this.busqueda_p_e()}>BUSCAR</button>
        </div>

        <h1>DEPORTES</h1>

        <div>
          <table className='table'>
            <tbody>
              {this.state.data_3.map(evento =>{ // pide la data de la peticion_get para mapear
                return (
                  <tr>
                    <td style={style_css_hidden}>{evento.mar_id}</td>
                    <td>{evento.equi_id_1}</td>
                    <td>{evento.mar_equi_1}</td>
                    <td>{evento.equi_id_2}</td>
                    <td>{evento.mar_equi_2}</td>
                    <td >
                      <button className='btn btn-primary'>
                        <FontAwesomeIcon icon={faEdit} onClick={() => {this.selecionar_evento(evento); this.modal_insertar()}} />
                      </button>
                    </td>

                  </tr>

                )
              })}
            </tbody>
          </table>
        </div>

      </div>
    )
  }
  
  ///////////////////////////


  handle_change= async e =>{ // esta en principal, registers, login, events, render( modal_insertar, modal_dep, modal_equi )
    e.persist(); // por eso debemos  especificar persistencia

    if(e.target.name == "usu_email" || e.target.name == "usu_clave" || e.target.name == "usu_nombre"){
      await this.setState({ // await  regresa  la ejecucion dela funcion asincrona despues de la ejecucion
        form:{
          ...this.state.form, // siver para conservar los datos que ya tiene el arreglo
          [e.target.name]: e.target.value // los nombres de los inputs deben ser iguales
        }
      })
      //console.log(this.state.form) // porbar por consola lo que se guarda
    }
    if(e.target.name === "dep_nombre"){
      await this.setState({ // await  regresa  la ejecucion dela funcion asincrona despues de la ejecucion
        form_deportes:{
          ...this.state.form_deportes, // siver para conservar los datos que ya tiene el arreglo
          [e.target.name]: e.target.value // los nombres de los inputs deben ser iguales
        }
      })
      //console.log(this.state.form_deportes) // porbar por consola lo que se guarda
    }
    if(e.target.name === "equi_nombre" || e.target.name === "dep_id"){
      await this.setState({ // await  regresa  la ejecucion dela funcion asincrona despues de la ejecucion
        form_equipos:{
          ...this.state.form_equipos, // siver para conservar los datos que ya tiene el arreglo
          [e.target.name]: e.target.value // los nombres de los inputs deben ser iguales
        }
      })
      //console.log(this.state.form_equipos) // porbar por consola lo que se guarda
    }
    if(e.target.name === "equi_id_1" || e.target.name === "equi_id_2"  
      || e.target.name === "mar_fecha_event"  || e.target.name === "mar_fecha_registro"
      || e.target.name === "mar_hora_event"  || e.target.name === "mar_hora_registro"
      || e.target.name === "mar_equi_1"  || e.target.name === "mar_equi_2"
      || e.target.name === "mar_dep_id"  || e.target.name === "mar_usu_id"){
      await this.setState({ // await  regresa  la ejecucion dela funcion asincrona despues de la ejecucion
        form_events:{
          ...this.state.form_events, // siver para conservar los datos que ya tiene el arreglo
          [e.target.name]: e.target.value // los nombres de los inputs deben ser iguales
        }
      })
      //console.log(this.state.form_events) // porbar por consola lo que se guarda
    }
    //console.log(this.state.form_events) // porbar por consola lo que se guarda
    //console.log(this.state.usuario_id)
  }

  selecionar_evento= (evento) =>{ // esta en events
    this.setState({
      tipo_modal: 'actualizar',
      form_events: {
        mar_id: evento.mar_id,
        mar_equi_1: evento.mar_equi_1,
        mar_equi_2: evento.mar_equi_2,
      }
    })
    {console.log(this.state.form_events)}
  }

  componentDidMount(){
    this.peticion_get()
    this.peticion_get_multi_p(this.state.form_search.mar_dep_id)
    this.peticion_get_multi_e(this.state.form_search.mar_dep_id)
    this.peticion_get_deportes()
    this.peticion_get_equipos()
    this.peticion_get_usuarios()
    this.setState({auth: window.localStorage.getItem("tipo")})
    this.setState({usuario_n: window.localStorage.getItem("registro")})

  }


  render(){
    // style_css_prueba no funciona en en div classname="app"
    const style_css_prueba = {
      background: "red"
    } 
    return (  
      <div className="App" style={style_css_prueba}>
        {this.state.logueado ? this.rdtc_l():"" }
        <BrowserRouter>
          <Routes>
            <Route path="/deportescolombia/" /*element={<Layout />}*/>
            <Route index element= {this.principal() } />
            <Route path="register" element={this.registers()} />
            <Route path="login" element={this.login()} />
            <Route path="events" element={ this.state.auth ? this.events():this.principal()} />
            <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>

        <Modal isOpen={this.state.modal_insertar}>
          <ModalHeader style={{display:"block"}}></ModalHeader>
          <ModalBody>
          {
              this.state.tipo_modal == 'insertar' ? 
            <div>
              <h1>REGISTRAR EVENTO</h1>
              <div>
                <label htmlFor='mar_fecha_event'>FECHA EVENTO</label>
                <input type="date"name="mar_fecha_event"  onChange={this.handle_change}></input>
                <label htmlFor='mar_fecha_registro'>FECHA REGISTRO</label>
                <input type="date"name="mar_fecha_registro"  onChange={this.handle_change}></input>
              </div>

              <div>
                <label htmlFor='mar_hora_event'>HORA EVENTO</label>
                <input type="time"name="mar_hora_event"  onChange={this.handle_change}></input>
                <label htmlFor='mar_hora_registro'>HORA REGISTRO</label>
                <input type="time"name="mar_hora_registro"  onChange={this.handle_change}></input>
              </div>

              <div>
                <label htmlFor='equi_id_1'>EQUIPO LOCAL</label>
                <select name="equi_id_1" onChange={this.handle_change}>
                  <option value="">ELIGE UN EQUIPO</option>
                  {this.state.data_equipo.map(evento =>{ 
                    return (
                    <option value={evento.equi_nombre}>{evento.equi_nombre}</option>
                    )
                  })}
                </select>
                <label htmlFor='equi_id_2'>EQUIPO VISITANTE</label>
                <select name="equi_id_2" onChange={this.handle_change}>
                  <option value="">ELIGE UN EQUIPO</option>
                  {this.state.data_equipo.map(evento =>{ 
                    return (
                    <option value={evento.equi_nombre}>{evento.equi_nombre}</option>
                    )
                  })}
                </select>
              </div>

              <div>
                <label htmlFor='mar_equi_1'>MARCADOR LOCAL</label>
                <input className='form-control' type="text" name='mar_equi_1' id='mar_equi_1' onChange={this.handle_change} value={this.state.form_events ? this.state.form_events.mar_equi_1 : ''} ></input> 
                <label htmlFor='mar_equi_2'>MARCADOR VISITANTE</label>
                <input className='form-control' type="text" name='mar_equi_2' id='mar_equi_2' onChange={this.handle_change} value={this.state.form_events ? this.state.form_events.mar_equi_2 : ''} ></input>
              </div>

              <div>
                <label htmlFor='mar_dep_id'>DEPORTE</label>
                <select name="mar_dep_id" onChange={this.handle_change}>
                  <option value="">ELIGE UN DEPORTE</option>
                  {this.state.data_deporte.map(evento =>{ 
                    return (
                    <option value={evento.dep_nombre}>{evento.dep_nombre}</option>
                    )
                  })}
                </select>
                <label htmlFor='mar_usu_id'>REGISTRO</label>
                <select name="mar_usu_id" onChange={this.handle_change}>
                  <option value="">ELIGE TU NOMBRE</option>
                    <option value={this.state.usuario_n}>{this.state.usuario_n}</option>
                </select>
              </div>
            </div>
            :
            <div>
              <div>
              <input className='form-control' type="hidden" name='mar_id' id='mar_id' onChange={this.handle_change} value={this.state.form_events ? this.state.form_events.mar_id : ''} ></input> 
                <label htmlFor='mar_equi_1'>MARCADOR LOCAL</label>
                <input className='form-control' type="text" name='mar_equi_1' id='mar_equi_1' onChange={this.handle_change} value={this.state.form_events ? this.state.form_events.mar_equi_1 : ''} ></input> 
                <label htmlFor='mar_equi_2'>MARCADOR VISITANTE</label>
                <input className='form-control' type="text" name='mar_equi_2' id='mar_equi_2' onChange={this.handle_change} value={this.state.form_events ? this.state.form_events.mar_equi_2 : ''} ></input>
              </div>
            </div>
          }
          </ModalBody>
          <ModalFooter>
            {
              this.state.tipo_modal == 'insertar' ? 
              <button className='btn btn-success' onClick={() => this.peticion_post_events()}>INSERTAR</button>
              : <button className='btn btn-success' onClick={() => this.peticion_put()}>MODIFICAR</button>
            }
            <button className='btn btn-danger' onClick={() => {this.modal_insertar(); this.setState({form_events: ""})}}>CANCELAR</button>
          </ModalFooter>
        </Modal>
        
        <Modal isOpen={this.state.modal_dep}>
          <ModalHeader style={{display:"block"}}></ModalHeader>
          <ModalBody>
            <div>
              <h1>REGISTRAR DEPORTE</h1>
              <div>
                <label htmlFor='dep_nombre'>DEPORTE</label>
                <input className='form-control' type="text" name='dep_nombre' id='dep_nombre' onChange={this.handle_change} value={this.state.form_deportes ? this.state.form_deportes.dep_nombre : ''} ></input>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button className='btn btn-success' onClick={() => this.peticion_post_deportes()}>INSERTAR</button>     
            <button className='btn btn-danger' onClick={() => this.modal_deporte()}>CANCELAR</button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modal_equi}>
          <ModalHeader style={{display:"block"}}></ModalHeader>
          <ModalBody>
            <div>
              <h1>REGISTRAR EQUIPO</h1>
              <div>
                <label htmlFor='equi_nombre'>NUEVO EQUIPO</label>
                <input className='form-control' type="text" name='equi_nombre' id='equi_nombre' onChange={this.handle_change} value={this.state.form_equipos ? this.state.form_equipos.equi_nombre : ''} ></input>

                <label htmlFor='dep_id'>ELIGE DEPORTE</label>
                <select name="dep_id" onChange={this.handle_change}>
                  <option value="" >ELIGE UN DEPORTE</option>
                  {this.state.data_deporte.map(evento =>{ 
                    return (
                      <option value={evento.dep_nombre}>{evento.dep_nombre}</option>
                    )
                  })}
                </select>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button className='btn btn-success' onClick={() => this.peticion_post_equipo()}>INSERTAR</button>     
            <button className='btn btn-danger' onClick={() => this.modal_equipo()}>CANCELAR</button>
          </ModalFooter>
        </Modal>

      </div>
    )
  };

}

export default App;
