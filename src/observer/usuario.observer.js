export class UsuarioObserver {
    #suscriptores = new Set();

    suscribir(suscriptor) {
        if (typeof suscriptor !== 'function') {
            throw new TypeError('El suscriptor debe ser una función');
        }

        this.#suscriptores.add(suscriptor);
        return () => this.#suscriptores.delete(suscriptor);
    }

    notificar(evento) {
        for (const suscriptor of this.#suscriptores) {
            suscriptor(evento);
        }
    }
}

export const usuarioObserver = new UsuarioObserver();

usuarioObserver.suscribir(({ tipo, usuarioId }) => {
    if (tipo === 'usuario_registrado') {
        console.info(`Nuevo usuario registrado: ${usuarioId}`);
    }
});