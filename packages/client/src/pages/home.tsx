import store from '../store/store';

function Home() {
    const stor = store();
    console.log();
    return (
        <>
            twdtagfdfsgdf ::{' '}
            {stor.api['/api/data_example'].loading
                ? 'loading...'
                : JSON.stringify(stor.api.get('/api/data_example'))}
        </>
    );
}

export default Home;
