const UsuarioMiddlewares=( req, res, next)=>{
    if (!req.user || req.user.role !== 'usuario'){
        return res.status(403).send({ error: 'Acceso denegado. Se requiere estar registrado'});
    }
    next();
}

export default UsuarioMiddlewares;