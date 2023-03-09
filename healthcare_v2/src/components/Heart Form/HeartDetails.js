import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react'
import { BiChevronRight, BiChevronLeft } from 'react-icons/bi';
import { Link, useHistory } from 'react-router-dom';
import img2 from '../../assets/section-title-line.png'

import { initializeApp } from "firebase/app";
import { FacebookAuthProvider, getAuth } from "firebase/auth";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";

import InputSlider from './InputSlider';

export default function HeartDetails() {
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
        "chest pain": 0,
        "resting blood pressure": 0,
        "cholestoral": 0,
        "fasting blood sugar": 0,
        "resting electrocardiographic results": 0,
        "exercise induced angina": 0,
        "ST depression induced by exercise relative to rest": 0,
        "slope": 0,
        "number of major vessels (0-3) colored by flourosopy": 0,
        "thal": 0
    })
    const history = useHistory()
    const HandleStorage = (val, parameter) => {
        // console.log(val,parameter)
        if (parameter === "Chest Pain")
            setSelected(selected => ({ ...selected, "chest pain": val }))
        if (parameter === "Trestbps")
            setSelected(selected => ({ ...selected, "resting blood pressure": val }))
        if (parameter === "Cholestoral")
            setSelected(selected => ({ ...selected, "cholestoral": val }))
        if (parameter === "Fasting Blood Sugar")
            setSelected(selected => ({ ...selected, "fasting blood sugar": val }))
        if (parameter === "Rest ECG")
            setSelected(selected => ({ ...selected, "resting electrocardiographic results": val }))
        if (parameter === "Exang")
            setSelected(selected => ({ ...selected, "exercise induced angina": val }))
        if (parameter === "Old Peak")
            setSelected(selected => ({ ...selected,  "ST depression induced by exercise relative to rest": val }))
        if (parameter === "Slope")
            setSelected(selected => ({ ...selected,  "slope": val }))
        if (parameter === "CA")
            setSelected(selected => ({ ...selected,  "number of major vessels (0-3) colored by flourosopy": val }))
        if (parameter === "Thal")
            setSelected(selected => ({ ...selected,  "thal": val }))
        // Swal.fire('Incomplete Form !', 'Please fill up all the details...', 'warning')

    }
    const handleSubmit = () => {
        // console.log(selected)
        history.push({ pathname: "/heartform/disease", state: { selected: selected } })
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
                    <h1 className='display-5' style={{ fontFamily: "Calibre M", lineHeight: 1.1, color: "var(--heading-color)", marginBottom: "-2px", letterSpacing: "-0.2px", marginTop: window.innerWidth > 700 ? "5px" : "10px" }}>Heart Report</h1>
                    <div className='pos-rel' style={{ paddingBottom: "15px" }}>
                        <img src={img2} alt="" style={{ filter: "grayScale(1) opacity(0.6) drop-shadow(0 0 0 var(--first-color))" }} />
                    </div>
                    <div className="row mb-8">

                        <div className='col-xl-4 col-lg-5 pb-3'>
                            <InputSlider HandleStorage={HandleStorage} parameter={"Chest Pain"} min={0} max={3} default={0} details={"Chest Pain Type"} />

                        </div>
                        <div className='col-xl-4 col-lg-5 pb-3'>

                            <InputSlider HandleStorage={HandleStorage} parameter={"Trestbps"} min={94} max={200} default={94} details={"Resting Blood Pressure (in mm Hg)"} />
                        </div>
                        <div className='col-xl-4 col-lg-5 pb-3'>

                            <InputSlider HandleStorage={HandleStorage} parameter={"Cholestoral"} min={126} max={564} default={126} details={"Serum Cholestoral in mg/dt"} />
                        </div>


                        <div className='col-xl-4 col-lg-5 pb-3'>
                            <InputSlider HandleStorage={HandleStorage} parameter={"Fasting Blood Sugar"} min={0} max={1} default={0} details={"Fasting Blood Sugar >120mg/dl (1 = true; 0 = false)"} />

                        </div>
                        <div className='col-xl-4 col-lg-5 pb-3'>

                            <InputSlider HandleStorage={HandleStorage} parameter={"Rest ECG"} min={0} max={2} default={0} details={"Resting Electrocardiographic Results"} />
                        </div>
                        <div className='col-xl-4 col-lg-5 pb-3'>

                            <InputSlider HandleStorage={HandleStorage} parameter={"Exang"} min={0} max={1} default={0} details={"Exercise Induced Angina (1 = yes; 0 = no)"} />
                        </div>
                        <div className='col-xl-4 col-lg-5 pb-3'>

                            <InputSlider HandleStorage={HandleStorage} parameter={"Old Peak"} min={0} max={7} default={0} details={"ST depression induced by exercise relative to rest"} />
                        </div>
                        <div className='col-xl-4 col-lg-5 pb-3'>
                            <InputSlider HandleStorage={HandleStorage} parameter={"Slope"} min={0} max={2} default={0} details={"The Slope of the peak exercise ST segment"} />
                        </div>
                        <div className='col-xl-4 col-lg-5 pb-3'>
                            <InputSlider HandleStorage={HandleStorage} parameter={"CA"} min={0} max={4} default={0} details={"Number of major vessels (0-3) colored by flourosopy"} />
                        </div>
                        <div className='col-xl-4 col-lg-5 pb-3'>
                            <InputSlider HandleStorage={HandleStorage} parameter={"Thal"} min={0} max={3} default={0} details={"1 = Normal; 2 = Fixed Defect; 3 = Reversible Defect"} />
                        </div>
                    </div>


                </motion.div>
                <div className='' style={{ position: "absolute", bottom: 0, paddingBottom: "0.5rem" }}>
                    <Link to="/"><button type="button" className="btn btn-primary rounded-2 ms-auto me-auto me-4 my-4 btn_hover gray-bg" data-mdb-ripple-color="var(--first-color)" style={{ borderColor: "var(--first-color)", padding: "9px 20px", fontSize: "14px", marginTop: "20px", color: 'var(--first-color)', fontFamily: 'SF Mono' }}><BiChevronLeft size={24} style={{ verticalAlign: "-7.5px" }} />  Back</button></Link>
                </div>
                <div className='' style={{ paddingRight: "3rem", position: "absolute", bottom: 0, right: 0, paddingBottom: "0.5rem" }}>
                    <button onClick={handleSubmit} type="button" className="btn btn-primary rounded-2 ms-auto me-auto me-4 my-4 btn_hover" data-mdb-ripple-color="var(--first-color)" style={{ background: "var(--first-color) var(--mdb-gradient)", borderColor: "var(--first-color)", padding: "9px 20px", fontSize: "14px", marginTop: "20px", color: '#FFF', fontFamily: 'SF Mono' }}>Next <BiChevronRight size={24} style={{ verticalAlign: "-7.5px" }} /> </button>
                </div>
            </div>

        </section>

    )
}
