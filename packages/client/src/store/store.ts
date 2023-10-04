import { create } from 'zustand';
import { withLenses } from '@dhmk/zustand-lens';
import exampleSlice, { ExampleStore } from './example.slice';
import apiSlice, { APIStore } from './api.slice';

export type StoreState = {
    example: ExampleStore;
    api: APIStore;
};

const store = create<StoreState>(
    withLenses({
        example: exampleSlice,
        api: apiSlice,
    }),
);

export default store;
