const AdministradorMiddlewares=( req, res, next)=>{
    if (!req.user || req.user.role !== 'administrator'){
        return res.status(403).send({ error: 'Acceso denegado. Se requiere ser administrador'});
    }
    next();
}

export default AdministradorMiddlewares;