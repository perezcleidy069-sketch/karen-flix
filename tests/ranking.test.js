import test from 'node:test';
import assert from 'node:assert/strict';
import { calcularRanking } from '../src/utils/ranking.js';

test('suma el promedio de puntuaciones y likes, y resta dislikes', () => {
    assert.equal(calcularRanking({ promedio: 8.5, likes: 4, dislikes: 1 }), 11.5);
});

test('los dislikes reducen el ranking', () => {
    assert.ok(
        calcularRanking({ promedio: 8, likes: 2, dislikes: 3 }) <
        calcularRanking({ promedio: 8, likes: 3, dislikes: 2 })
    );
});

test('una película sin votos conserva el promedio de sus reseñas', () => {
    assert.equal(calcularRanking({ promedio: 7.25 }), 7.25);
});
