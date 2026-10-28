import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';

export default class ActoresModel{
    #id;
    #nombre;
    #apellido;

    constructor(data){
        this.#id=data.id || null ;
        this.#nombre=data.nombre;
        this.#apellido=data.apellido;

    }

    obtenerDatos(data){
        return {
            id:this.#id,
            nombre:this.#nombre,
            apellido:this.#apellido
        }

    }
}