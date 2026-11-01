import test from 'node:test';
import assert from 'node:assert/strict';
import { crearUsuarioRegistro } from '../src/factory/usuario.factory.js';
import { UsuarioObserver } from '../src/observer/usuario.observer.js';

test('la Factory crea un usuario con valores opcionales predeterminados y rol seguro', () => {
    const usuario = crearUsuarioRegistro({
        nombre: 'Ana',
        email: 'ana@example.com',
        contrasena: 'hash-seguro',
        role: 'administrador'
    });

    assert.deepEqual(usuario, {
        nombre: 'Ana',
        apellido: null,
        email: 'ana@example.com',
        telefono: null,
        contrasena: 'hash-seguro',
        role: 'usuario',
        avatar_url: null
    });
});

test('el Observer notifica suscriptores y permite cancelar la suscripción', () => {
    const observer = new UsuarioObserver();
    const eventos = [];
    const cancelar = observer.suscribir((evento) => eventos.push(evento));

    observer.notificar({ tipo: 'usuario_registrado', usuarioId: 7 });
    cancelar();
    observer.notificar({ tipo: 'usuario_registrado', usuarioId: 8 });

    assert.deepEqual(eventos, [{ tipo: 'usuario_registrado', usuarioId: 7 }]);
});
