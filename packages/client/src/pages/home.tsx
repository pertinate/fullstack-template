import { memo } from 'react';
import store from '../store/store';

function Home() {
    const stor = store();

    console.log();
    return (
        <>
            twdtagfdfsgdf ::{' '}
            {/* {stor.api['/api/data'].loading
                ? 'loading...'
                : JSON.stringify(
                      stor.api.get({
                          url: '/api/data',
                      }),
                  )} */}
        </>
    );
}

export default Home;
