import { Getter, Lens, lens, Setter } from '@dhmk/zustand-lens';
import { StoreApi } from 'zustand';
import { StoreState } from './store';
import { APIResponseExample } from '@local/types';

type APIState<T> = {
    data: T | undefined;
    loading: boolean;
    error: Error | null;
    ttl?: number;
    interval?: NodeJS.Timeout;
};

type State = {
    '/api/data_example': APIState<APIResponseExample>;
};

export type Actions = {
    fetchData: (url: keyof urlOnly) => void;
    get: (url: keyof urlOnly) => urlOnly[keyof urlOnly]['data'];
};

export type APIStore = State & Actions;

type urlOnly = Omit<APIStore, keyof Actions>;

const actions: (
    set: Setter<APIStore>,
    get: Getter<APIStore>,
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
                                data: json,
                                loading: false,
                                error: null,
                            },
                        });
                    });
                })
                .catch((error: Error) => {
                    const store = get();
                    const storeData = store[url as keyof urlOnly];
                    set({
                        [url]: {
                            ...storeData,
                            loading: false,
                            error,
                        },
                    });
                });
        },
        get: (url) => {
            const store = get();
            const storeData = store[url];

            if (!storeData.data && !storeData.loading) {
                const storeData = get()[url];

                set({
                    [url]: {
                        ...storeData,
                        loading: true,
                        interval:
                            storeData.ttl === undefined ||
                            storeData.ttl === null
                                ? undefined
                                : !storeData.interval
                                ? setInterval(
                                      () => get().fetchData(url),
                                      storeData.ttl,
                                  )
                                : storeData.interval,
                    },
                });
                get().fetchData(url);
            }
            return storeData.data;
        },
    };
};

const defaultValue = {
    data: undefined,
    ttl: 60000,
    loading: false,
    error: null,
};

const slice: Lens<APIStore, StoreState> = (set, get, api, path) => {
    const apiRoutes: State = {
        '/api/data_example': defaultValue,
    };

    return {
        ...apiRoutes,
        ...actions(set, get, api, path),
    };
};

export default lens(slice);
