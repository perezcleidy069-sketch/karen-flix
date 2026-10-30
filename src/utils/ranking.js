export function calcularRanking({ promedio = 0, likes = 0, dislikes = 0, diasDesdeResena = 36500 }) {
    const calificacion = Number(promedio);
    const meGusta = Number(likes);
    const noMeGusta = Number(dislikes);
    const dias = Math.max(0, Number(diasDesdeResena));
    const balanceVotos = Math.min(10, Math.max(-10, meGusta - noMeGusta));
    const frescura = 10 * Math.exp(-dias / 365);

    return Number((calificacion * 0.7 + balanceVotos * 0.2 + frescura * 0.1).toFixed(2));
}
