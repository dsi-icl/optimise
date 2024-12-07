import { afterAll, beforeAll } from 'vitest';

beforeAll(() => {
    (global as any).optimise = '🥳';
});

afterAll(() => {
    delete (global as any).optimise
});