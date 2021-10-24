import React, {
    useEffect
} from 'react';

import Messager from '@plurid/messager';

import logo from './logo.svg';
import './App.css';



const messager = new Messager(
    'localhost:56865',
    '__TEST_MODE__',
    'socket',
    {
        secure: false,
    },
);

// const messager = new Messager(
//     'localhost:56865',
//     '__TEST_MODE__',
//     'event',
//     {
//         secure: false,
//     },
// );



function App() {
    useEffect(() => {
        // setTimeout(() => {
        //     console.log('subscribe');
        //     messager.subscribe('some.topic', (data) => {
        //         console.log(data);
        //     });
        // }, 1000)

        // setTimeout(() => {
        //     console.log('publish');
        //     messager.publish('some.topic', {
        //         data: 'one',
        //     });
        // }, 2000)

        console.log('subscribe');
        messager.subscribe('some.topic', (data) => {
            console.log(data);
        });

        console.log('publish');
        messager.publish('some.topic', {
            data: 'one',
        });
    });

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
