import React from 'react'
import {TextField, Button, Typography} from '@material-ui/core'
import {NavLink} from "react-router-dom";
import {useState} from 'react';
import axios from 'axios';

const Signup = () => {
    const btn_style = {margin: '8px 0'}
    const [errors, setErrors] = useState('');
    const [msg, setMsg] = useState('');
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: ""
    });

    const {name, email, password} = user;
    const onInputChange = e => {
        setUser({...user, [e.target.name]: e.target.value});
    };

    async function signup() {
        let result = await axios.post("/api/register", user).then(response => {
            setMsg('Registration Successful')
            setUser({name: "", email: "", password: ""})
            navigate('/');
        }).catch((error) => {
            setErrors(error.response.data.message);
        });
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card text-center">
                        <div className="card-header">
                            <h2>Sign Up</h2>
                            <h4 style={{color: "red"}}>{errors}</h4>
                            <h4 style={{color: "green"}}>{msg}</h4>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-12">
                                    <TextField label='Name' name="name" value={name} onChange={e => onInputChange(e)}
                                               placeholder='Enter Name' type='text' fullWidth required/>
                                </div>
                                <div className="col-md-12 mt-2">
                                    <TextField label='Email' name="email" value={email} onChange={e => onInputChange(e)}
                                               placeholder='Enter Email' type='text' fullWidth required/>
                                </div>
                                <div className="col-md-12 mt-2">
                                    <TextField label='Password' name="password" value={password}
                                               onChange={e => onInputChange(e)} placeholder='Enter password' type='password'
                                               fullWidth required/>
                                </div>
                                <div className="col-md-12">
                                    <Button type='submit' onClick={signup} color='primary' variant="contained"
                                            style={btn_style} fullWidth>Register</Button>
                                </div>
                                <div className="col-md-12">
                                    <Typography> Don't Have Account ?
                                        <NavLink to="/">
                                            <span style={{marginLeft: "4px"}}>Login</span>
                                        </NavLink>
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup
