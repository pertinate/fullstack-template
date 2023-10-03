import { Getter, Lens, lens, Setter } from '@dhmk/zustand-lens';
import { StoreApi } from 'zustand';
import { StoreState } from './store';

type State = {
    '/api/data_example': {
        data: unknown | undefined;
        staleAt: number;
        loading: boolean;
        error: boolean;
        // getData: unknown | undefined;
    };
};

export type Actions = {
    fetchData: (url: string) => void;
    get: (url: string) => unknown | undefined;
};

export type TestStore = State & Actions;

const actions: (
    set: Setter<TestStore>,
    get: Getter<TestStore>,
    api: StoreApi<StoreState>,
    path: ReadonlyArray<string>,
) => Actions = (set, get, api): Actions => {
    return {
        fetchData: (url: string) => {
            // set({ msg });
            fetch(url)
                .then((data) => {
                    const store = get();
                    type urlOnly = Omit<typeof store, 'fetchData'>;
                    const storeData = store[url as keyof urlOnly];
                    //trigger update to this.data that would re-render whatever is using it
                    data.json().then((json) => {
                        set({
                            [url]: {
                                ...storeData,
                                staleAt: new Date().valueOf() + 60000,
                                data: json,
                                loading: false,
                                error: false,
                            },
                        });
                    });
                })
                .catch(() => {
                    const store = get();
                    type urlOnly = Omit<typeof store, 'fetchData'>;
                    const storeData = store[url as keyof urlOnly];
                    set({
                        [url]: {
                            ...storeData,
                            loading: false,
                            error: true,
                        },
                    });
                });
        },
        get: (url: string) => {
            const store = get();
            type urlOnly = Omit<typeof store, 'fetchData' | 'get'>;
            const storeData = store[url as keyof urlOnly];
            console.log('getting data');
            if (
                (new Date().valueOf() > storeData.staleAt ||
                    storeData.staleAt == 0) &&
                !storeData.loading
            ) {
                const test = get()['/api/data_example'];

                set({
                    '/api/data_example': {
                        ...test,
                        loading: true,
                    },
                });
                get().fetchData('/api/data_example');
            }
            return storeData.data;
        },
    };
};

const slice: Lens<TestStore, StoreState> = (set, get, api, path) => {
    const apiRoutes: State = {
        '/api/data_example': {
            data: undefined,
            staleAt: 0,
            loading: false,
            error: false,
            // get getData() {

            // },
        },
    };
    return {
        ...apiRoutes,
        ...actions(set, get, api, path),
    };
};

export default lens(slice);
