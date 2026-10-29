const autorizarUsuario=( req, res, next)=>{
    const auth =req.signedCookies.auth;

    if(!auth){
        return res.status(401).send({ error: 'Usuario no autorizado.'});

    }
    req.user = auth;
    next();
}

export default autorizarUsuario;