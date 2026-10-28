import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';

export default class UsuarioModel{
    #id;
    #nombre;
    #apellido;
    #email;
    #telefono;
    #contrasena;
    #role;
    #activo;
    #likes;
    #dislikes;

    constructor(data){
        this.#id=data.id || null;
        this.#nombre=data.nombre;
        this.#apellido=data.apellido;
        this.#email=data.email;
        this.#telefono=data.telefono;
        this.#contrasena=data.constrasena;
        this.#role=data.role;
        this.#activo=data.activo;
        this.#likes=data.likes || 0;
        this.#dislikes=data.dislikes || 0;


    }

    async guardadr(){
        try{
            const seguridad=10;
        const constrasenacriptada= await bcrypt.hash(this.#contrasena, seguridad);

        const query = 'INSERT INTO usuarios(nombre, apellido, email, telefono, contrasena, role, activo, likes, dislikes) VALUE (?, ?, ?, ?, ?, ?, ?, ?, ?)';

        const valores =[
            this.#nombre,
            this.#apellido,
            this.#email,
            this.#telefono,
            constrasenacriptada,
            this.#role,
            this.#activo,
            this.#likes,
            this.#dislikes
        ];

        const [result]= await pool.execute(query, valores);
        this.#id= result.insertId;
        

        return{
            success: true,
            id: this.#id,
            mensaje: `El ${role} ha sido registrado existosamente`
        };
        }catch (error){
            next(error)
        }
    }

    static async obtenerTodos(){
        try{
            const [fila]= await pool.query('SELECT id, nombre, apellido, email, telefono, contrasena, role, activo, likes, dislikes FROM usuarios');
            return fila;
        }catch(error){
            next(error)
        }
    }

    static async obtenerPorId(id){
        try{
            const [lista]= await pool.query('SELECT id, nombre, apellido')
        }catch(error){
            next(error)
        }

    }

    obtenerDatos(){
        return{
            id:this.#id,
            nombre:this.#nombre,
            apellido:this.#apellido,
            email:this.#email,
            telefono:this.#telefono,
            contrasena:this.#contrasena,
            role:this.#role,
            activo:this.#activo,
            likes:this.#likes,
            dislikes:this.#dislikes
        }

    }
}