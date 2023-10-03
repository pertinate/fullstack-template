import { create } from 'zustand';
import { withLenses } from '@dhmk/zustand-lens';
import exampleSlice, { ExampleStore } from './example.slice';
import testSlice, { TestStore } from './test.slice';

export type StoreState = {
    example: ExampleStore;
    test: TestStore;
};

const store = create<StoreState>(
    withLenses({
        example: exampleSlice,
        test: testSlice,
    }),
);

export default store;
