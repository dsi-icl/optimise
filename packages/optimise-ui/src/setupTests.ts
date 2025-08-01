// @ts-nocheck
import { afterAll, beforeAll } from 'vitest';

beforeAll(() => {
    global.optimise = '🥳';
});

afterAll(() => {
    delete global.optimise;
});
