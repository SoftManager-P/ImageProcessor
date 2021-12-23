import React, {useEffect, useState} from 'react'
import {Button} from '@material-ui/core'
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import Select from "react-dropdown-select";


const Home = () => {

    const btn_style = {margin: '8px 0'}
    const [msg, setMsg] = useState('');
    const [errors, setErrors] = useState('');
    const [type, setType] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    const navigate = useNavigate();
    let users = JSON.parse(localStorage.getItem('users'));


    const onSelectChange = (value) => {
        setType(value[0].value)
        fileUpload(value[0].value)
    }

    const logout = () => {
        axios.get("/api/logout", {
            "token": users.token
        }).then(response => {
            setMsg(response.data.message);
            localStorage.removeItem("users")
            navigate("/");
        }).catch((error) => {
            setMsg(error.response.data.message);
        });

    }



    const createImage = (file) =>{
        let reader = new FileReader();
        reader.onload = (e) => {
            setSelectedFile(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    const onChange = (e) => {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length)
            return;
        // setSelectedFile(files[0]);
        createImage(files[0]);
    }
    const fileUpload = (img_type)  => {
        setMsg('')
        setErrors('')
        const url = '/api/upload_image';
        const formData  = {type:img_type,image: selectedFile,token: users.token};

        if(formData.type === "" || formData.selectedFile === ""){
            alert("Provide all detail");
        }else{
            axios({
                method: 'post',
                url: url,
                data: formData,
                // headers: {'Content-Type': 'multipart/form-data' }
            }).then(function (response) {
                    setMsg('Image saved')
                setErrors('')
                })
                .catch((error) => {
                    setErrors(error.response.data.error.image[0]);
                    setMsg('')
                });
        }
    }

    const onFormSubmit = (e) =>{
        e.preventDefault()
        fileUpload();
    }


    const techCompanies = [
        { label: "Original", value: 1 },
        { label: "Square of original size", value: 2 },
        { label: "Small ", value: 3 },
        { label: "All three", value: 4 },
    ];

    return (
        <div className="">
            <div className="container mt-5 ">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card ">
                            <div className="card-header">
                                <div className="row">
                                    <div className="col-md-6"><h2>Process image </h2></div>
                                    <div className="col-md-6">
                                        <Button type='submit' onClick={logout} color='primary'
                                                variant="contained"
                                                style={btn_style} fullWidth>Logout</Button>
                                    </div>
                                </div>

                            </div>
                            <div className="card-body text-left">I'm tiny React component in Laravel app!
                                <h4 style={{color: "green"}}>{msg}</h4>
                                <h4 style={{color: "red"}}>{errors}</h4>
                                <form onSubmit={onFormSubmit}>
                                    <div className="form-group  my-2">
                                        <label htmlFor="">File </label>
                                        <br/>
                                        <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={onChange}/>
                                    </div>
                                    <div className="form-group my-2">
                                        <label htmlFor="">Type</label>
                                        <Select options={techCompanies} onChange={onSelectChange} />
                                    </div>
                                    {/*<div className="form-group my-2">*/}
                                    {/*    <button className="btn btn-success" type="submit">Submit</button>*/}
                                    {/*</div>*/}
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Home
