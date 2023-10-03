import { Getter, Lens, lens, Setter } from '@dhmk/zustand-lens';
import { StoreApi } from 'zustand';
import { StoreState } from './store';

type State = {
    msg: string;
};

const state: State = {
    msg: '',
};

export type Actions = {
    getMsg: (msg: string) => void;
};

export type ExampleStore = State & Actions;

const actions: (
    set: Setter<ExampleStore>,
    get: Getter<ExampleStore>,
    api: StoreApi<StoreState>,
    path: ReadonlyArray<string>,
) => Actions = (set, get, api): Actions => {
    return {
        getMsg: (msg: string) => {
            set({ msg });
        },
    };
};

const slice: Lens<ExampleStore, StoreState> = (set, get, api, path) => {
    return {
        ...state,
        ...actions(set, get, api, path),
    };
};

export default lens(slice);
