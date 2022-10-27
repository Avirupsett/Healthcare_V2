import React, { useEffect, useState } from 'react'
import { MultiSelect } from "react-multi-select-component";
import { BiChevronRight, BiChevronLeft } from 'react-icons/bi';
import { Link, useHistory } from 'react-router-dom';
import './Symptoms.css'
import img2 from '../../assets/section-title-line.png'
import { motion} from 'framer-motion';
import Swal from 'sweetalert2'
import { initializeApp } from "firebase/app";
import { FacebookAuthProvider, getAuth } from "firebase/auth";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";

const options = [{ label: "Abdominal Pain", value: "Abdominal Pain" },
{ label: "Abnormal Menstruation", value: "Abnormal Menstruation" },
{ label: "Acidity", value: "Acidity" },
{ label: "Acute Liver Failure", value: "Acute Liver Failure" },
{ label: "Altered Sensorium", value: "Altered Sensorium" },
{ label: "Anxiety", value: "Anxiety" },
{ label: "Back Pain", value: "Back Pain" },
{ label: "Belly Pain", value: "Belly Pain" },
{ label: "Blackheads", value: "Blackheads" },
{ label: "Bladder Discomfort", value: "Bladder Discomfort" },
{ label: "Blister", value: "Blister" },
{ label: "Blood In Sputum", value: "Blood In Sputum" },
{ label: "Bloody Stool", value: "Bloody Stool" },
{ label: "Blurred And Distorted Vision", value: "Blurred And Distorted Vision" },
{ label: "Breathlessness", value: "Breathlessness" },
{ label: "Brittle Nails", value: "Brittle Nails" },
{ label: "Bruising", value: "Bruising" },
{ label: "Burning Micturition", value: "Burning Micturition" },
{ label: "Chest Pain", value: "Chest Pain" },
{ label: "Chills", value: "Chills" },
{ label: "Cold Hands And Feet", value: "Cold Hands And Feet" },
{ label: "Coma", value: "Coma" },
{ label: "Congestion", value: "Congestion" },
{ label: "Constipation", value: "Constipation" },
{ label: "Continuous Feel Of Urine", value: "Continuous Feel Of Urine" },
{ label: "Continuous Sneezing", value: "Continuous Sneezing" },
{ label: "Cough", value: "Cough" },
{ label: "Cramps", value: "Cramps" },
{ label: "Dark Urine", value: "Dark Urine" },
{ label: "Dehydration", value: "Dehydration" },
{ label: "Depression", value: "Depression" },
{ label: "Diarrhoea", value: "Diarrhoea" },
{ label: "Dyschromic Patches", value: "Dyschromic Patches" },
{ label: "Distention Of Abdomen", value: "Distention Of Abdomen" },
{ label: "Dizziness", value: "Dizziness" },
{ label: "Drying And Tingling Lips", value: "Drying And Tingling Lips" },
{ label: "Enlarged Thyroid", value: "Enlarged Thyroid" },
{ label: "Excessive Hunger", value: "Excessive Hunger" },
{ label: "Extra Marital Contacts", value: "Extra Marital Contacts" },
{ label: "Family History", value: "Family History" },
{ label: "Fast Heart Rate", value: "Fast Heart Rate" },
{ label: "Fatigue", value: "Fatigue" },
{ label: "Fluid Overload.1", value: "Fluid Overload.1" },
{ label: "Foul Smell Of Urine", value: "Foul Smell Of Urine" },
{ label: "Headache", value: "Headache" },
{ label: "High Fever", value: "High Fever" },
{ label: "Hip Joint Pain", value: "Hip Joint Pain" },
{ label: "History Of Alcohol Consumption", value: "History Of Alcohol Consumption" },
{ label: "Increased Appetite", value: "Increased Appetite" },
{ label: "Indigestion", value: "Indigestion" },
{ label: "Inflammatory Nails", value: "Inflammatory Nails" },
{ label: "Internal Itching", value: "Internal Itching" },
{ label: "Irregular Sugar Level", value: "Irregular Sugar Level" },
{ label: "Irritability", value: "Irritability" },
{ label: "Irritation In Anus", value: "Irritation In Anus" },
{ label: "Itching", value: "Itching" },
{ label: "Joint Pain", value: "Joint Pain" },
{ label: "Knee Pain", value: "Knee Pain" },
{ label: "Lack Of Concentration", value: "Lack Of Concentration" },
{ label: "Lethargy", value: "Lethargy" },
{ label: "Loss Of Appetite", value: "Loss Of Appetite" },
{ label: "Loss Of Balance", value: "Loss Of Balance" },
{ label: "Loss Of Smell", value: "Loss Of Smell" },
{ label: "Loss Of Taste", value: "Loss Of Taste" },
{ label: "Malaise", value: "Malaise" },
{ label: "Mild Fever", value: "Mild Fever" },
{ label: "Mood Swings", value: "Mood Swings" },
{ label: "Movement Stiffness", value: "Movement Stiffness" },
{ label: "Mucoid Sputum", value: "Mucoid Sputum" },
{ label: "Muscle Pain", value: "Muscle Pain" },
{ label: "Muscle Wasting", value: "Muscle Wasting" },
{ label: "Muscle Weakness", value: "Muscle Weakness" },
{ label: "Nausea", value: "Nausea" },
{ label: "Neck Pain", value: "Neck Pain" },
{ label: "Nodal Skin Eruptions", value: "Nodal Skin Eruptions" },
{ label: "Obesity", value: "Obesity" },
{ label: "Pain Behind The Eyes", value: "Pain Behind The Eyes" },
{ label: "Pain During Bowel Movements", value: "Pain During Bowel Movements" },
{ label: "Pain In Anal Region", value: "Pain In Anal Region" },
{ label: "Painful Walking", value: "Painful Walking" },
{ label: "Palpitations", value: "Palpitations" },
{ label: "Passage Of Gases", value: "Passage Of Gases" },
{ label: "Patches In Throat", value: "Patches In Throat" },
{ label: "Phlegm", value: "Phlegm" },
{ label: "Polyuria", value: "Polyuria" },
{ label: "Prominent Veins On Calf", value: "Prominent Veins On Calf" },
{ label: "Puffy Face And Eyes", value: "Puffy Face And Eyes" },
{ label: "Pus Filled Pimples", value: "Pus Filled Pimples" },
{ label: "Receiving Blood Transfusion", value: "Receiving Blood Transfusion" },
{ label: "Receiving Unsterile Injections", value: "Receiving Unsterile Injections" },
{ label: "Red Sore Around Nose", value: "Red Sore Around Nose" },
{ label: "Red Spots Over Body", value: "Red Spots Over Body" },
{ label: "Redness Of Eyes", value: "Redness Of Eyes" },
{ label: "Restlessness", value: "Restlessness" },
{ label: "Runny Nose", value: "Runny Nose" },
{ label: "Rusty Sputum", value: "Rusty Sputum" },
{ label: "Scurrying", value: "Scurrying" },
{ label: "Shivering", value: "Shivering" },
{ label: "Silver Like Dusting", value: "Silver Like Dusting" },
{ label: "Sinus Pressure", value: "Sinus Pressure" },
{ label: "Skin Peeling", value: "Skin Peeling" },
{ label: "Skin Rash", value: "Skin Rash" },
{ label: "Slurred Speech", value: "Slurred Speech" },
{ label: "Small Dents In Nails", value: "Small Dents In Nails" },
{ label: "Spinning Movements", value: "Spinning Movements" },
{ label: "Spotting Urination", value: "Spotting Urination" },
{ label: "Stiff Neck", value: "Stiff Neck" },
{ label: "Stomach Bleeding", value: "Stomach Bleeding" },
{ label: "Stomach Pain", value: "Stomach Pain" },
{ label: "Sunken Eyes", value: "Sunken Eyes" },
{ label: "Sweating", value: "Sweating" },
{ label: "Swelled Lymph Nodes", value: "Swelled Lymph Nodes" },
{ label: "Swelling Joints", value: "Swelling Joints" },
{ label: "Swelling Of Stomach", value: "Swelling Of Stomach" },
{ label: "Swollen Blood Vessels", value: "Swollen Blood Vessels" },
{ label: "Swollen Extremities", value: "Swollen Extremities" },
{ label: "Swollen Legs", value: "Swollen Legs" },
{ label: "Throat Irritation", value: "Throat Irritation" },
{ label: "Tiredness", value: "Tiredness" },
{ label: "Toxic Look (Typhus)", value: "Toxic Look (Typhus)" },
{ label: "Ulcers On Tongue", value: "Ulcers On Tongue" },
{ label: "Unsteadiness", value: "Unsteadiness" },
{ label: "Visual Disturbances", value: "Visual Disturbances" },
{ label: "Vomiting", value: "Vomiting" },
{ label: "Watering From Eyes", value: "Watering From Eyes" },
{ label: "Weakness In Limbs", value: "Weakness In Limbs" },
{ label: "Weakness Of One Body Side", value: "Weakness Of One Body Side" },
{ label: "Weight Gain", value: "Weight Gain" },
{ label: "Weight Loss", value: "Weight Loss" },
{ label: "Yellow Crust Ooze", value: "Yellow Crust Ooze" },
{ label: "Yellow Urine", value: "Yellow Urine" },
{ label: "Yellowing Of Eyes", value: "Yellowing Of Eyes" },
{ label: "Yellowish Skin", value: "Yellowish Skin" }];


export default function Symptoms() {
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
useEffect(() => {
    authenticate()

})
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
  const [selected, setSelected] = useState([]);
  const [arr, setarr] = useState([]);
  const [auth, setauth] = useState(0)
  const history = useHistory()

  useEffect(() => {

    const arr2 = []
    selected.forEach((e) => {
      arr2.push(e.label)
    })

    setarr(arr2)

  }, [selected, setSelected])

  const HandleStorage = () => {

let defaultvalue={"Abdominal Pain":0,
"Abnormal Menstruation":0,
"Acidity":0,
"Acute Liver Failure":0,
"Altered Sensorium":0,
"Anxiety":0,
"Back Pain":0,
"Belly Pain":0,
"Blackheads":0,
"Bladder Discomfort":0,
"Blister":0,
"Blood In Sputum":0,
"Bloody Stool":0,
"Blurred And Distorted Vision":0,
"Breathlessness":0,
"Brittle Nails":0,
"Bruising":0,
"Burning Micturition":0,
"Chest Pain":0,
"Chills":0,
"Cold Hands And Feet":0,
"Coma":0,
"Congestion":0,
"Constipation":0,
"Continuous Feel Of Urine":0,
"Continuous Sneezing":0,
"Cough":0,
"Cramps":0,
"Dark Urine":0,
"Dehydration":0,
"Depression":0,
"Diarrhoea":0,
"Dyschromic Patches":0,
"Distention Of Abdomen":0,
"Dizziness":0,
"Drying And Tingling Lips":0,
"Enlarged Thyroid":0,
"Excessive Hunger":0,
"Extra Marital Contacts":0,
"Family History":0,
"Fast Heart Rate":0,
"Fatigue":0,
"Fluid Overload.1":0,
"Foul Smell Of Urine":0,
"Headache":0,
"High Fever":0,
"Hip Joint Pain":0,
"History Of Alcohol Consumption":0,
"Increased Appetite":0,
"Indigestion":0,
"Inflammatory Nails":0,
"Internal Itching":0,
"Irregular Sugar Level":0,
"Irritability":0,
"Irritation In Anus":0,
"Itching":0,
"Joint Pain":0,
"Knee Pain":0,
"Lack Of Concentration":0,
"Lethargy":0,
"Loss Of Appetite":0,
"Loss Of Balance":0,
"Loss Of Smell":0,
"Loss Of Taste":0,
"Malaise":0,
"Mild Fever":0,
"Mood Swings":0,
"Movement Stiffness":0,
"Mucoid Sputum":0,
"Muscle Pain":0,
"Muscle Wasting":0,
"Muscle Weakness":0,
"Nausea":0,
"Neck Pain":0,
"Nodal Skin Eruptions":0,
"Obesity":0,
"Pain Behind The Eyes":0,
"Pain During Bowel Movements":0,
"Pain In Anal Region":0,
"Painful Walking":0,
"Palpitations":0,
"Passage Of Gases":0,
"Patches In Throat":0,
"Phlegm":0,
"Polyuria":0,
"Prominent Veins On Calf":0,
"Puffy Face And Eyes":0,
"Pus Filled Pimples":0,
"Receiving Blood Transfusion":0,
"Receiving Unsterile Injections":0,
"Red Sore Around Nose":0,
"Red Spots Over Body":0,
"Redness Of Eyes":0,
"Restlessness":0,
"Runny Nose":0,
"Rusty Sputum":0,
"Scurrying":0,
"Shivering":0,
"Silver Like Dusting":0,
"Sinus Pressure":0,
"Skin Peeling":0,
"Skin Rash":0,
"Slurred Speech":0,
"Small Dents In Nails":0,
"Spinning Movements":0,
"Spotting Urination":0,
"Stiff Neck":0,
"Stomach Bleeding":0,
"Stomach Pain":0,
"Sunken Eyes":0,
"Sweating":0,
"Swelled Lymph Nodes":0,
"Swelling Joints":0,
"Swelling Of Stomach":0,
"Swollen Blood Vessels":0,
"Swollen Extremities":0,
"Swollen Legs":0,
"Throat Irritation":0,
"Tiredness":0,
"Toxic Look (Typhus)":0,
"Ulcers On Tongue":0,
"Unsteadiness":0,
"Visual Disturbances":0,
"Vomiting":0,
"Watering From Eyes":0,
"Weakness In Limbs":0,
"Weakness Of One Body Side":0,
"Weight Gain":0,
"Weight Loss":0,
"Yellow Crust Ooze":0,
"Yellow Urine":0,
"Yellowing Of Eyes":0,
"Yellowish Skin":0
}
    if(selected.length>0){    

     let testarr = []
    selected.forEach((e) => {
       testarr.push(" "+e.label)
      let value = e.label
      defaultvalue[`${value}`]=1
    })
   
    sessionStorage.setItem("Selected",String(testarr))
    // console.log(testarr)
    sessionStorage.setItem("Symptoms",JSON.stringify(defaultvalue))
    history.push("/form/disease")
  }
  else{
    Swal.fire('No Symptoms Found !','Select one or more Symptoms to Proceed...','warning')
  }
  }


  return (

    <section className='d-flex align-items-start form gray-bg' style={{ minHeight: window.innerWidth>800?"78vh":"76vh", paddingTop: "30px", flexDirection: 'column' }}>
      <div className="container">
        <motion.div
        initial={{ opacity: 0,x:-25 }}
        animate={{ opacity: 1,x:0 }}
        exit={{ opacity:0 }}
        transition={{ duration: .5 }}
        >
        <h1 className='display-5' style={{ fontFamily: "Calibre M", lineHeight: 1.1, color: "var(--heading-color)", marginBottom: "-2px", letterSpacing: "-0.2px",marginTop:window.innerWidth>700?"5px":"10px" }}>Select Symptoms</h1>
        <div className='pos-rel' style={{ paddingBottom: "24px" }}>
          <img src={img2} alt="" style={{filter:"grayScale(1) opacity(0.6) drop-shadow(0 0 0 var(--first-color))"}}/>
        </div>
        <h1 className='fs-6 mb-4 selected' style={{ fontFamily: "SF Mono", color: "rgb(100, 117, 137)" }}>(Selected {(selected).length} out of {options.length})</h1>

        {/* <pre>{JSON.stringify(selected)}</pre> */}

        <MultiSelect
          className={`mb-4 ${window.innerWidth>800?'w-75':'w-100'}`}
          options={options}
          value={selected}
          onChange={setSelected}
          labelledBy="Select"
          hasSelectAll={false}
        />
        <div className='fs-5 selected2 d-flex' style={{ fontFamily: "Calibre R" }}>
          <div className='' style={{ fontFamily: "Calibre R", color: "var(--first-color)",letterSpacing:'1.2px', minWidth: "max-content",fontWeight:600,paddingRight: "15px", paddingLeft: "5px" }}>Symptoms : </div>
          {(selected).length > 0 ? <div style={{ paddingBottom: "100px",paddingLeft:'10px' }}>{arr.map((ele) => {
            return (<li key={ele} style={{ listStyleType: "square", fontFamily: "Calibre R", color: "var(--text-color)" }}>{ele}</li>)
          })}</div> : <div style={{ fontFamily: "Calibre R", color: "var(--text-color)" }}>Select Atleast One !</div>}
        </div>
        </motion.div>
        <div className='' style={{ position: "absolute", bottom: 0, paddingBottom: "0.5rem" }}>
          <Link to="/form/details"><button type="button" className="btn btn-primary rounded-2 ms-auto me-auto me-4 my-4 btn_hover gray-bg" data-mdb-ripple-color="var(--first-color)" style={{ borderColor: "var(--first-color)", padding: "9px 20px", fontSize: "14px", marginTop: "20px", color: 'var(--first-color)', fontFamily: 'SF Mono' }}><BiChevronLeft size={24} style={{ verticalAlign: "-7.5px" }} />  Back</button></Link>
        </div>
        <div className='' style={{ paddingRight: "3rem", position: "absolute", bottom: 0, right: 0, paddingBottom: "0.5rem" }}>
          <button onClick={HandleStorage} type="button" className="btn btn-primary rounded-2 ms-auto me-auto me-4 my-4 btn_hover" data-mdb-ripple-color="var(--first-color)" style={{ background: "var(--first-color) var(--mdb-gradient)", borderColor: "var(--first-color)", padding: "9px 20px", fontSize: "14px", marginTop: "20px", color: '#FFF', fontFamily: 'SF Mono' }}>Next <BiChevronRight size={24} style={{ verticalAlign: "-7.5px" }} /> </button>
        </div>
      </div>

    </section>

  )
}
