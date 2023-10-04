import { Getter, Lens, lens, Setter } from '@dhmk/zustand-lens';
import { StoreApi } from 'zustand';
import { StoreState } from './store';
import { APIResponseExample } from '@local/types';

type APIState<T> = {
    data: T | undefined;
    staleAfterMs?: number;
    staleAtMs?: number;
    loading: boolean;
    error: boolean;
    refetchMs?: number;
    interval?: NodeJS.Timeout;
};

type State = {
    '/api/data_example': APIState<APIResponseExample>;
};

export type Actions = {
    fetchData: (url: keyof urlOnly) => void;
    get: (url: keyof urlOnly) => urlOnly[keyof urlOnly]['data'];
};

export type TestStore = State & Actions;

type urlOnly = Omit<TestStore, 'fetchData' | 'get'>;

const actions: (
    set: Setter<TestStore>,
    get: Getter<TestStore>,
    api: StoreApi<StoreState>,
    path: ReadonlyArray<string>,
) => Actions = (set, get, api): Actions => {
    return {
        fetchData: (url: keyof urlOnly) => {
            fetch(url)
                .then((data) => {
                    const store = get();
                    const storeData = store[url as keyof urlOnly];

                    data.json().then((json) => {
                        set({
                            [url]: {
                                ...storeData,
                                staleAtMs: storeData.staleAfterMs
                                    ? new Date().valueOf() +
                                      storeData.staleAfterMs
                                    : undefined,
                                data: json,
                                loading: false,
                                error: false,
                            },
                        });
                    });
                })
                .catch(() => {
                    const store = get();
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
        get: (url) => {
            const store = get();
            const storeData = store[url];

            if (
                ((storeData.staleAfterMs &&
                    new Date().valueOf() > storeData.staleAfterMs) ||
                    storeData.staleAfterMs == 0 ||
                    !storeData.data) &&
                !storeData.loading
            ) {
                const test = get()[url];

                set({
                    [url]: {
                        ...test,
                        loading: true,
                        interval: storeData.refetchMs
                            ? setInterval(
                                  () => get().fetchData(url),
                                  storeData.refetchMs,
                              )
                            : undefined,
                    },
                });
                get().fetchData(url);
            }
            return storeData.data;
        },
    };
};

const slice: Lens<TestStore, StoreState> = (set, get, api, path) => {
    const apiRoutes: State = {
        '/api/data_example': {
            data: undefined,
            staleAfterMs: 60000,
            loading: false,
            error: false,
        },
    };
    //look at the possibility of immediately fetching the data?
    return {
        ...apiRoutes,
        ...actions(set, get, api, path),
    };
};

export default lens(slice);
