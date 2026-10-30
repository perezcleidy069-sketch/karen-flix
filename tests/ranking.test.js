import test from 'node:test';
import assert from 'node:assert/strict';
import { calcularRanking } from '../src/utils/ranking.js';

test('combina rating, balance de votos y frescura', () => {
    assert.equal(calcularRanking({ promedio: 10, likes: 10, dislikes: 0, diasDesdeResena: 0 }), 10);
});

test('limita el balance de votos y no premia fechas futuras', () => {
    assert.equal(calcularRanking({ promedio: 10, likes: 100, dislikes: 0, diasDesdeResena: -10 }), 10);
});

test('la frescura disminuye con reseñas antiguas', () => {
    assert.ok(
        calcularRanking({ promedio: 8, diasDesdeResena: 365 }) <
        calcularRanking({ promedio: 8, diasDesdeResena: 0 })
    );
});
