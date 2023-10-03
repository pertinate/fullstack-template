import store from '../store/store';

function Home() {
    const stor = store();
    console.log(stor.test.get('/api/data_example'));
    return <>twdtagfdfsgdf</>;
}

export default Home;
