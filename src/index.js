import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import Sesion from './components/Sesion/Sesion';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.css';
const urlServer = "http://192.168.1.54:3500";

ReactDOM.render(<BrowserRouter><Sesion url={urlServer} /></BrowserRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
