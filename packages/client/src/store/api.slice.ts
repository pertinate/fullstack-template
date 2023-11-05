import { Getter, Lens, lens, Setter } from '@dhmk/zustand-lens';
import { StoreApi } from 'zustand';
import { StoreState } from './store';
import {
    APIResponseExample,
    APIRoutes,
    backendRouting,
    getFrontendAPIRoute,
    test,
} from '@local/types';
import { z } from 'zod';

type APIState<T> = {
    data: T | undefined;
    optimisticData: T | undefined;
    loading: boolean;
    error: Error | null;
    isOptimistic?: boolean;
    ttl?: number;
    interval?: NodeJS.Timeout;
};

const defaultValue = {
    data: undefined,
    optimisticData: undefined,
    ttl: 60000,
    loading: false,
    error: null,
    isOptimistic: false,
};

const apiRoutes = {
    [APIRoutes['/api/data']]: defaultValue as APIState<APIResponseExample>,
    [APIRoutes['/api/data/:myParamOne/:myParamTwo?/:myParamThree']]:
        defaultValue as APIState<APIResponseExample>,
};

type State = typeof apiRoutes;

export type APIIntake = {
    url: (typeof test)[number];
    body?: z.infer<
        (typeof backendRouting)[(typeof test)[number]]['bodySchema']
    >;
    params?: z.infer<
        (typeof backendRouting)[(typeof test)[number]]['paramSchema']
    >;
    query?: z.infer<
        (typeof backendRouting)[(typeof test)[number]]['querySchema']
    >;
    cooldown?: number;
};

export type FetchDataIntake = APIIntake & {
    test?: number;
};

export type Actions = {
    fetchData: (data: FetchDataIntake) => void;
    get: (data: APIIntake) => {
        data: urlOnly[keyof urlOnly]['data'];
        isLoading: urlOnly[keyof urlOnly]['loading'];
        error: urlOnly[keyof urlOnly]['error'];
        forceRefetch: () => void;
    };
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
        fetchData: (data) => {
            const key = data.url;

            const apiRoute = getFrontendAPIRoute(key)(data.params, data.query);
            console.log(apiRoute);
            fetch(apiRoute.url, {
                method: apiRoute.method,
                body: data.body ? JSON.stringify(data.body) : undefined,
            })
                .then((data) => {
                    const store = get();
                    const storeData = store[key];

                    data.json().then((json) => {
                        console.log(json);
                        set({
                            [key]: {
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
                    const storeData = store[key];
                    set({
                        [key]: {
                            ...storeData,
                            loading: false,
                            error,
                        },
                    });
                });
        },
        get: (data) => {
            const store = get();
            const key = data.url;
            const storeData = store[key];

            if (!storeData.data && !storeData.loading) {
                const storeData = get()[key];

                set({
                    [key]: {
                        ...storeData,
                        loading: true,
                        interval:
                            storeData.ttl === undefined ||
                            storeData.ttl === null
                                ? undefined
                                : !storeData.interval
                                ? setInterval(
                                      () => get().fetchData(data),
                                      storeData.ttl,
                                  )
                                : storeData.interval,
                    },
                });
                console.log(data);
                get().fetchData(data);
            }

            return {
                data: storeData.data,
                isLoading: storeData.loading,
                error: storeData.error,
                forceRefetch: () => get().fetchData(data),
            };
        },
    };
};

const slice: Lens<APIStore, StoreState> = (set, get, api, path) => {
    return {
        ...apiRoutes,
        ...actions(set, get, api, path),
    };
};

export default lens(slice);
