import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Routes, BrowserRouter} from "react-router-dom";
import Login from "../src/Login";
import Signup from "../src/Signup";
import Home from "../src/Home";


function App() {
    return (
        <Router>
            <div className="app">
                {/*<NavBar />*/}
                <Routes>
                    <Route path="/" element={<Login/>}></Route>
                    <Route exact path="/home" element={<Home/>}></Route>
                    <Route exact path="/signup" element={<Signup/>}></Route>
                </Routes>
                {/*<Footer />*/}
            </div>

        </Router>
    );
}

export default App;

if (document.getElementById('root')) {
    ReactDOM.render(<App/>, document.getElementById('root'));
}
