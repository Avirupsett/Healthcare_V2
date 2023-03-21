import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react'
import { BiChevronRight, BiChevronLeft } from 'react-icons/bi';
import { Link, useHistory } from 'react-router-dom';
import img2 from '../../assets/section-title-line.png'
// import "./Disease.css"
// import Swal from 'sweetalert2'
import { initializeApp } from "firebase/app";
import { FacebookAuthProvider, getAuth } from "firebase/auth";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
// import { getAnalytics, setUserProperties } from "firebase/analytics";
import InputSlider from './InputSlider';

export default function DiabetesDetails() {
    const firebaseConfig = {
        apiKey: "AIzaSyBjp-WIwo1nZzMWhlC1x2BL_p5_vU417Bw",
        authDomain: "healthcare-138d6.firebaseapp.com",
        projectId: "healthcare-138d6",
        storageBucket: "healthcare-138d6.appspot.com",
        messagingSenderId: "50530283279",
        appId: "1:50530283279:web:b32704148f9355da25587a",
        measurementId: "G-1M9JQ4VDP7"
    };
    const app = initializeApp(firebaseConfig);
    // const analytics = getAnalytics(app);
    useEffect(() => {
        authenticate()
       
    })
    const [auth, setauth] = useState(0)
    
    const authenticate = () => {
        // Build Firebase credential with the Google ID token.
        if (auth === 0) {
            setauth(1)
            const id_token = sessionStorage.getItem("user_token")
            if (id_token) {
                let credential;
                if (sessionStorage.getItem("provider") === 'google')
                    credential = GoogleAuthProvider.credential(null, id_token);
                else
                    credential = FacebookAuthProvider.credential(id_token);

                // Sign in with credential from the Google user.
                const auth = getAuth(app);
                signInWithCredential(auth, credential).then((result) => {
                    // const user = result.user;
                  
                   
                }).catch((error) => {
                    history.push('/')
                    document.getElementById("handlelogin").click()
                });
            }
            else {
                history.push('/')
            }
        }
    }
  
    const [selected, setSelected] = useState({
        "Pregnancies": 0,
        "Glucose": 0,
        "BloodPressure": 0,
        "Insulin": 0,
        "BMI": 0,
        "Age":0
    })
    const history = useHistory()
    const HandleStorage = (val,parameter) => {
        // console.log(val,parameter)
        if(parameter==="Pregnancies")
        setSelected(selected=>({...selected,"Pregnancies": val}))
        if(parameter==="Glucose")
        setSelected(selected=>({...selected,"Glucose": val}))
        if(parameter==="Blood Pressure")
        setSelected(selected=>({...selected,"BloodPressure": val}))
        if(parameter==="Insulin")
        setSelected(selected=>({...selected,"Insulin": val}))
        if(parameter==="BMI")
        setSelected(selected=>({...selected,"BMI": val}))
        if(parameter==="Age")
        setSelected(selected=>({...selected,"Age": val}))
            // Swal.fire('Incomplete Form !', 'Please fill up all the details...', 'warning')
      
    }
    const handleSubmit=()=>{
        // console.log(selected)
        history.push({pathname:"/diabetesform/disease",state:{selected:selected}})
    }


    return (

        <section className='d-flex align-items-start form gray-bg' style={{ minHeight: window.innerWidth > 800 ? "78vh" : "76vh", paddingTop: "30px", flexDirection: 'column' }}>
            <div className="container" >
                <motion.div
                    initial={{ opacity: 0, x: -25 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: .5 }}
                >
                    <h1 className='display-5' style={{ fontFamily: "Calibre M", lineHeight: 1.1, color: "var(--heading-color)", marginBottom: "-2px", letterSpacing: "-0.2px", marginTop: window.innerWidth > 700 ? "5px" : "10px" }}>Diabetes Test</h1>
                    <div className='pos-rel' style={{ paddingBottom: "15px" }}>
                        <img src={img2} alt="" style={{ filter: "grayScale(1) opacity(0.6) drop-shadow(0 0 0 var(--first-color))" }} />
                    </div>
                    <div className="row mb-8">

                    <div className='col-xl-4 col-lg-6 col-md-6 pb-3'>
                   <InputSlider HandleStorage={HandleStorage} parameter={"Pregnancies"} min={0} max={17} default={0} details={"Number of times pregnant"}/>
    
                    </div>
                    <div className='col-xl-4 col-lg-6 col-md-6 pb-3'>

                   <InputSlider HandleStorage={HandleStorage} parameter={"Glucose"} min={0} max={199} default={0} details={"Plasma glucose concentration a 2 hours in an oral glucose tolerance test"}/>
                    </div>
                    <div className='col-xl-4 col-lg-6 col-md-6 pb-3'>

                   <InputSlider HandleStorage={HandleStorage} parameter={"Blood Pressure"} min={0} max={122} default={0} details={"Diastolic blood pressure (mm Hg)"}/>
                    </div>
                    
                    <div className='col-xl-4 col-lg-6 col-md-6 pb-3'>

                   <InputSlider HandleStorage={HandleStorage} parameter={"Insulin"} min={0} max={846} default={0} details={"2-Hour serum insulin (mu U/ml)"}/>
                    </div>
                    <div className='col-xl-4 col-lg-6 col-md-6 pb-3'>

                   <InputSlider HandleStorage={HandleStorage} parameter={"BMI"} min={0} max={68} default={0} details={"Body mass index (weight in kg/(height in m)^2)"}/>
                    </div>
                    <div className='col-xl-4 col-lg-6 col-md-6 pb-3'>

                   <InputSlider HandleStorage={HandleStorage} parameter={"Age"} min={0} max={81} default={0} details={"Age (years)"}/>
                    </div>
                    </div>
                    

                </motion.div>
                <div className='' style={{ position: "absolute", bottom: 0, paddingBottom: "0.5rem" }}>
                    <Link to="/form/disease"><button type="button" className="btn btn-primary rounded-2 ms-auto me-auto me-4 my-4 btn_hover gray-bg" data-mdb-ripple-color="var(--first-color)" style={{ borderColor: "var(--first-color)", padding: "9px 20px", fontSize: "14px", marginTop: "20px", color: 'var(--first-color)', fontFamily: 'SF Mono' }}><BiChevronLeft size={24} style={{ verticalAlign: "-7.5px" }} />  Back</button></Link>
                </div>
                <div className='' style={{ paddingRight: "3rem", position: "absolute", bottom: 0, right: 0, paddingBottom: "0.5rem" }}>
                    <button onClick={handleSubmit} type="button" className="btn btn-primary rounded-2 ms-auto me-auto me-4 my-4 btn_hover" data-mdb-ripple-color="var(--first-color)" style={{ background: "var(--first-color) var(--mdb-gradient)", borderColor: "var(--first-color)", padding: "9px 20px", fontSize: "14px", marginTop: "20px", color: '#FFF', fontFamily: 'SF Mono' }}>Next <BiChevronRight size={24} style={{ verticalAlign: "-7.5px" }} /> </button>
                </div>
            </div>

        </section>

    )
}
