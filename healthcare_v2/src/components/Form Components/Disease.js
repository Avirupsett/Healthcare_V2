import React, { useState } from 'react'
import img2 from '../../assets/section-title-line.png'
import { BiChevronRight, BiChevronLeft } from 'react-icons/bi';
import { Link, useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { motion} from 'framer-motion';
import { initializeApp } from "firebase/app";
import { FacebookAuthProvider, getAuth } from "firebase/auth";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
// import { getAnalytics} from "firebase/analytics";
import ControlledAccordions from '../Accordion';
import Swal from 'sweetalert2';

export default function Disease() {
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
const history = useHistory()
const [auth, setauth] = useState(0)
const authenticate = () => {
    // Build Firebase credential with the Google ID token.
    if(auth===0){
      setauth(1)
    const id_token = sessionStorage.getItem("user_token")
    if (id_token) {
      let credential;
      if(sessionStorage.getItem("provider")==='google')
       credential = GoogleAuthProvider.credential(null, id_token);
      else
       credential = FacebookAuthProvider.credential( id_token);

        // Sign in with credential from the Google user.
        const auth = getAuth(app);
        signInWithCredential(auth, credential).then((result) => {
            
        }).catch((error) => {
          history.push('/')
          document.getElementById("handlelogin").click()
        });
    }
    else{
        history.push('/')
    }
  }
}
  const [disease, setdisease] = useState([])
  const [ispredict, setispredict] = useState(0)

  async function predict(bodycontent) {
    let headersList = {
      "Accept": "*/*",
      "Content-Type": "application/json",
    }

    // let response = await fetch("/predict", {
    //   method: "POST",
    //   body: bodycontent,
    //   headers: headersList
    // });
    if(ispredict===0){
      setispredict(1)
    // fetch("/predict", {
    //   method: "POST",
    //   body: bodycontent,
    //   headers: headersList
    // }).then(response => response.json())
    //   .then(results => {
    //     setdisease(parseInt(results.results.results))
    //     logEvent(analytics, 'disease_predicted', { disease: encoded[parseInt(results.results.results)].Disease});
    //     logEvent(analytics, 'symptoms', { name: sessionStorage.getItem("Selected")});
    //     sessionStorage.setItem("Disease",results.results.results)
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
      fetch("/multipredict", {
        method: "POST",
        body: bodycontent,
        headers: headersList
      }).then(response => response.json())
        .then(results => {
          let output=results.results
          if(output.length>0){
          setdisease(output)

          sessionStorage.setItem("Disease",output[0])
          }
          else{
            Swal.fire("Sorry, Model Can't Guess","Try choosing two or more different symptoms","question")
            history.push('/form/symptoms')
          }
        
        })
        .catch((error) => {
          console.log(error);
        });
    }
    // let data = await response.json();
    // console.log(data.results.results);
  }

  useEffect(() => {

    let predictdata = sessionStorage.getItem("Symptoms")
    predict(predictdata)

  })

  return (
    <section className='d-flex align-items-start form gray-bg' style={{ minHeight: window.innerWidth > 800 ? "78vh" : "76vh", paddingTop: "30px", flexDirection: 'column' }}>
      <div className="container-fluid mb-5">
      <motion.div
        initial={{ opacity: 0,x:-25}}
        animate={{ opacity: 1,x:0 }}
        exit={{ opacity:0 }}
        transition={{ duration: .50 }}
        >
         <h1 className='display-5' style={{ fontFamily: "Calibre M", lineHeight: 1.1, color: "var(--heading-color)", marginBottom: "-2px", letterSpacing: "-0.2px", marginTop: window.innerWidth > 700 ? "5px" : "10px" }}>Disease Diagnosis</h1>
        <div className='pos-rel' style={{ paddingBottom: "24px" }}>
          <img src={img2} alt="" style={{filter:"grayScale(1) opacity(0.6) drop-shadow(0 0 0 var(--first-color))"}}/>
        </div>

        {/*<div className='fs-4 selected2 d-flex' style={{ fontFamily: "Calibre R" }}>
          <div className='' style={{ fontFamily: "Calibre R", color: "var(--first-color)", letterSpacing: '1.2px', minWidth: "max-content", fontWeight: 600, paddingRight: "15px", paddingLeft: "5px" }}>Disease : </div>
          <div style={{ paddingBottom: "20px" }}>
            {disease === -1 ? <div className="spinner-border text-secondary spinner-border-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </div> :<div style={{color: "var(--text-color)"}}>{encoded[disease].Disease}</div>}
          </div>
        </div>
        <div className='fs-4 selected2 d-flex' style={{ fontFamily: "Calibre R" }}>
          <div className='' style={{ fontFamily: "Calibre R", color: "var(--first-color)", letterSpacing: '1.2px', minWidth: "max-content", fontWeight: 600, paddingRight: "15px", paddingLeft: "5px" }}>Description : </div>
          <div style={{ paddingBottom: "20px" }}>
            {disease === -1 ? <div className="spinner-border text-secondary spinner-border-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </div> : <div style={{color: "var(--text-color)"}}>{encoded[disease].Symptom_Description}</div>}
          </div>
        </div>
        <div className='fs-4 selected2 d-flex' style={{ fontFamily: "Calibre R" }}>
          <div className='' style={{ fontFamily: "Calibre R", color: "var(--first-color)", letterSpacing: '1.2px', minWidth: "max-content", fontWeight: 600, paddingRight: "15px", paddingLeft: "5px" }}>Symptoms : </div>
          <div style={{ paddingBottom: "100px" }}>
            {disease === -1 ? <div className="spinner-border text-secondary spinner-border-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </div> :<div style={{color: "var(--text-color)"}}>{sessionStorage.getItem("Selected")}</div>}
          </div>
        </div> */}
         {disease.length === 0 ? <div className="spinner-border text-secondary spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div> :<ControlledAccordions multi={disease}/>}
        </motion.div>
        <div className='' style={{ position: "absolute", bottom: 0, paddingBottom: "0.5rem" }}>
          <Link to="/form/symptoms"><button type="button" className="btn btn-primary rounded-2 ms-auto me-auto me-4 my-4 btn_hover gray-bg" data-mdb-ripple-color="var(--first-color)" style={{ borderColor: "var(--first-color)", padding: "9px 20px", fontSize: "14px", marginTop: "20px", color: 'var(--first-color)', fontFamily: 'SF Mono' }}><BiChevronLeft size={24} style={{ verticalAlign: "-7.5px" }} />  Back</button></Link>
        </div>
        <div className='' style={{ paddingRight: "3rem", position: "absolute", bottom: 0, right: 0, paddingBottom: "0.5rem" }}>
          <Link to="/form/medication"><button type="button" className="btn btn-primary rounded-2 ms-auto me-auto me-4 my-4 btn_hover" data-mdb-ripple-color="var(--first-color)" style={{ background: "var(--first-color) var(--mdb-gradient)", borderColor: "var(--first-color)", padding: "9px 20px", fontSize: "14px", marginTop: "20px", color: '#FFF', fontFamily: 'SF Mono' }}>Next <BiChevronRight size={24} style={{ verticalAlign: "-7.5px" }} /> </button></Link>

        </div>
      </div>
    </section>
  )
}
