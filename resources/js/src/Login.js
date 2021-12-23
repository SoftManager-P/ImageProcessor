import React, {useState} from 'react'
import ReactDOM from 'react-dom';
import {Grid, Paper, Avatar, TextField, Button, Typography, Link as Nv} from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import axios from 'axios';
import {useNavigate, useParams, Link, NavLink} from "react-router-dom";

const Login = () => {

    const avatarStyle = {backgroundColor: '#3370bd'}
    const btn_style = {margin: '8px 0'}
    const [errors, setErrors] = useState('');
    const [msg, setMsg] = useState('');
    const [username, setUsername] = useState("");
    const [pass, setPass] = useState("");
        const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();
    const {email, password} = user;
    const onInputChange = e => {
        setUser({...user, [e.target.name]: e.target.value});
    };

    const signIn = () => {
        const users = {username};  // To Store Email in Localstore and send to Home Page
        if (user.email === '') {
            alert('Email Field is empty')
        } else if (user.password === '') {
            alert('Pass Field is empty')
        }
        axios.post("/api/login", user).then(response => {
            setMsg(response.data.message);
            localStorage.setItem("users",JSON.stringify(response.data));
            navigate('/home');
        }).catch((error) => {
            setMsg(error.response.data.message);
        });
    }


    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card text-center">
                        <div className="card-header ">
                            <h2>Sign In</h2>
                            <h4 style={{color: "red"}}>{errors}</h4>
                            <h4 style={{color: "green"}}>{msg}</h4>
                        </div>

                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-12">

                                    <TextField label='Email' name="email" value={email} onChange={e => onInputChange(e)}
                                               placeholder='Enter Email' type='text' fullWidth required/>
                                </div>
                                <div className="col-md-12 mt-2">

                                    <TextField label='Password' name="password" value={password}
                                               onChange={e => onInputChange(e)} placeholder='Enter password' type='password'
                                               fullWidth required/>
                                </div>

                                <div className="col-md-12">
                                    <Button type='submit' onClick={signIn} color='primary' variant="contained"
                                            style={btn_style} fullWidth>Login</Button>
                                </div>
                                <div className="col-md-12">
                                    <Typography> Don't Have Account ?
                                        <NavLink to="/signup">
                                            <span style={{marginLeft: "4px"}}>Sign Up</span>
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

export default Login
