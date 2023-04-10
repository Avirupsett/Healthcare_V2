import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react'
import { BiChevronRight, BiChevronLeft } from 'react-icons/bi';
import { Link, useHistory, useLocation } from 'react-router-dom';
import img2 from '../../assets/section-title-line.png'
// import "./Disease.css"
import { initializeApp } from "firebase/app";
import { FacebookAuthProvider, getAuth } from "firebase/auth";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import medicine from './Diabetes_Advance.json'
// import { getAnalytics, setUserProperties } from "firebase/analytics";

export default function DiabetesDisease() {
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

    const history = useHistory()
    const location = useLocation();

    const handleSubmit = () => {
        history.push({ pathname: "/diabetesform/diet", state: { disease: disease, selected: location.state.selected } })
    }
    const [disease, setdisease] = useState(-1)
    const [med, setMed] = useState(-1)
    const [ispredict, setispredict] = useState(0)

    async function predict(bodycontent) {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json",
        }
        if (ispredict === 0) {
            setispredict(1)
            fetch("/diabetes", {
                method: "POST",
                body: bodycontent,
                headers: headersList
            }).then(response => response.json())
                .then(results => {
                    setdisease(parseFloat(results.results.results))


                })
                .catch((error) => {
                    console.log(error);
                });
        }
        // let data = await response.json();
        // console.log(data.results.results);
    }

    useEffect(() => {
        let predictdata = JSON.stringify(location.state.selected)
        predict(predictdata)

    })
    useEffect(() => {
        if (disease > 0.5 && disease <= 0.6)
            setMed(0)
        else if (disease > 0.6 && disease <= 0.7)
            setMed(1)
        else if (disease > 0.7 && disease <= 0.8)
            setMed(2)
        else if (disease > 0.8 && disease <= 0.9)
            setMed(3)
        else if (disease > 0.9 && disease <= 1.0)
            setMed(4)
    }, [disease])


    return (

        <section className='d-flex align-items-start form gray-bg' style={{ minHeight: window.innerWidth > 800 ? "78vh" : "76vh", paddingTop: "30px", flexDirection: 'column' }}>
            <div className="container-fluid pe-lg-5" >
                <motion.div
                    initial={{ opacity: 0, x: -25 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: .5 }}
                >
                    <h1 className='display-5' style={{ fontFamily: "Calibre M", lineHeight: 1.1, color: "var(--heading-color)", marginBottom: "-2px", letterSpacing: "-0.2px", marginTop: window.innerWidth > 700 ? "5px" : "10px" }}>Diabetes Result</h1>
                    <div className='pos-rel' style={{ paddingBottom: "20px" }}>
                        <img src={img2} alt="" style={{ filter: "grayScale(1) opacity(0.6) drop-shadow(0 0 0 var(--first-color))" }} />
                    </div>
                    <div className="mbox mb-10">
                        <div className="row  justify-content-between align-items-center flex-wrap-reverse">
                            <div className="col-xxl-7 col-xl-7 col-lg-7 col-md-7  pe-0 " style={{ borderRadius: "10px", }}>
                                <div className='fs-4 selected2 d-flex' style={{ fontFamily: "Calibre R" }}>
                                    <div className='' style={{ fontFamily: "Calibre R", color: "var(--first-color)", letterSpacing: '1.2px', minWidth: "max-content", fontWeight: 600, paddingRight: "15px"}}>Diabetes : </div>
                                    <div style={{ paddingBottom: "20px" }}>
                                        {disease === -1 ? <div className="spinner-border text-secondary spinner-border-sm" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div> : <div style={{ color: "var(--text-color)" }}>{parseFloat(disease) > 0.5 ? "Positive" : `Negative`}</div>}
                                    </div>
                                </div>
                                <div className='fs-4 selected2 d-flex' style={{ fontFamily: "Calibre R" }}>
                                    <div className='' style={{ fontFamily: "Calibre R", color: "var(--first-color)", letterSpacing: '1.2px', minWidth: "max-content", fontWeight: 600, paddingRight: "15px"}}>Description : </div>
                                    <div style={{ paddingBottom: "20px" }}>
                                        {disease === -1 ? <div className="spinner-border text-secondary spinner-border-sm" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div> : <div style={{ color: "var(--text-color)" }}>{parseFloat(disease) > 0.5 && parseFloat(disease) <= 0.65 ? `Prediabetes - A condition in which blood sugar is high, but not high enough to be type 2 diabetes.\n With lifestyle changes, weight loss and medication, it's possible to bring a blood sugar level back to normal.` : parseFloat(disease) > 0.65 ? `A chronic disease that occurs when the pancreas is no longer able to make insulin, or when the body cannot make good use of the insulin it produces.` : `According to the report, you have been found to be completely free of diabetes`}</div>}
                                    </div>
                                </div>
                                <div className='fs-4 selected2 d-flex' style={{ fontFamily: "Calibre R" }}>
                                    <div className='' style={{ fontFamily: "Calibre R", color: "var(--first-color)", letterSpacing: '1.2px', minWidth: "max-content", fontWeight: 600, paddingRight: "15px"}}>Medicines : </div>
                                    <div style={{ paddingBottom: "20px" }}>
                                        {disease === -1 ? <div className="spinner-border text-secondary spinner-border-sm" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div> : med === -1 ? <div style={{ color: "var(--text-color)", width: "max-content" }}>No medication</div> : <div style={{ color: "var(--text-color)", width: "fit-content" }}>
                                            <li style={{ listStyleType: "square", fontFamily: "Calibre R", color: "var(--text-color)" }}>{medicine[med]["Medicine1"]}</li>
                                            <li style={{ listStyleType: "square", fontFamily: "Calibre R", color: "var(--text-color)" }}>{medicine[med]["Medicine2"]}</li>
                                            <li style={{ listStyleType: "square", fontFamily: "Calibre R", color: "var(--text-color)" }}>{medicine[med]["Medicine3"]}</li></div>}
                                    </div>
                                </div>
                            </div>
                            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 mb-4 me-5 pb-3 pb-md-0" style={{ borderRadius: "10px" }}>
                                {/* <ReactApexChart options={chartData3_2} series={chartData3_2.series} type="donut" height={`280px`} /> */}
                                <CircularProgressbar value={disease === -1 ? 0.0 : parseFloat(disease) * 100} text={`${disease === -1 ? 0.0 : parseInt(disease * 100)}%`}
                                    styles={buildStyles({
                                        // Rotation of path and trail, in number of turns (0-1)

                                        // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                                        strokeLinecap: 'round',

                                        // Text size
                                        // textSize: '16px',

                                        // How long animation takes to go from one percentage to another, in seconds
                                        // pathTransitionDuration: 0.5,

                                        // Can specify path transition in more detail, or remove it entirely
                                        // pathTransition: 'none',

                                        // Colors
                                        pathColor: `var(--first-color)`,
                                        textColor: `var(--first-color)`,
                                        // trailColor: 'var(--text-color)',
                                        // backgroundColor: 'var(--first-color-light)',
                                    })}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
                <div className='' style={{ position: "absolute", bottom: 0, paddingBottom: "0.5rem" }}>
                    <Link to="/diabetesform/details"><button type="button" className="btn btn-primary rounded-2 ms-auto me-auto me-4 my-4 btn_hover gray-bg" data-mdb-ripple-color="var(--first-color)" style={{ borderColor: "var(--first-color)", padding: "9px 20px", fontSize: "14px", marginTop: "20px", color: 'var(--first-color)', fontFamily: 'SF Mono' }}><BiChevronLeft size={24} style={{ verticalAlign: "-7.5px" }} />  Back</button></Link>
                </div>
                <div className='' style={{ paddingRight: "3rem", position: "absolute", bottom: 0, right: 0, paddingBottom: "0.5rem" }}>
                    <button onClick={handleSubmit} type="button" className="btn btn-primary rounded-2 ms-auto me-auto me-4 my-4 btn_hover" data-mdb-ripple-color="var(--first-color)" style={{ background: "var(--first-color) var(--mdb-gradient)", borderColor: "var(--first-color)", padding: "9px 20px", fontSize: "14px", marginTop: "20px", color: '#FFF', fontFamily: 'SF Mono' }}>Next <BiChevronRight size={24} style={{ verticalAlign: "-7.5px" }} /> </button>
                </div>
            </div>

        </section>

    )
}
