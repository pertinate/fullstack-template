import { memo } from 'react';
import store from '../store/store';

function Home() {
    const stor = store();
    const test = stor.api.get({
        url: '/api/data',
    });

    console.log(test);
    return <>twdtagfdfsgdf :: {JSON.stringify(test.data)}</>;
}

export default Home;
