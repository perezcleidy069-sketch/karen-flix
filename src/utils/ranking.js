export function calcularRanking({ promedio = 0, likes = 0, dislikes = 0 }) {
    const calificacion = Number(promedio);
    const meGusta = Number(likes);
    const noMeGusta = Number(dislikes);

    return Number((calificacion + meGusta - noMeGusta).toFixed(2));
}
