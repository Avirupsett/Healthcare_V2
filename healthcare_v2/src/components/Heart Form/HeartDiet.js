import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react'
import { BiChevronRight, BiChevronLeft } from 'react-icons/bi';
import { useHistory, useLocation } from 'react-router-dom';
import img2 from '../../assets/section-title-line.png'
// import "./Disease.css"
import { initializeApp } from "firebase/app";
import { FacebookAuthProvider, getAuth } from "firebase/auth";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import foodToEat from './food_eat_heart_advance.json'
import foodToAvoid from './food_avoid_heart_advance.json'
import diet from './Heart_Deases_Advance_chart.json'
import ReactApexChart from 'react-apexcharts';
import Swal from 'sweetalert2';
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import medicine from '../Form Components/disease_medicine.json'

export default function HeartDiet() {
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
  const db = getFirestore(app);
  // const analytics = getAnalytics(app);
  useEffect(() => {
    authenticate()

  })
  const [auth, setauth] = useState(0)
  const [user_uid, setuser_uid] = useState(0)
  const [country, setcountry] = useState("")
  const [city, setcity] = useState("")
  const [region, setregion] = useState("")
  const [lati, setlati] = useState("")
  const [long, setlong] = useState("")

  const add_data = async () => {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        uid: user_uid,
        name: sessionStorage.getItem("user_name"),
        email: sessionStorage.getItem("user_email"),
        dob: sessionStorage.getItem("user_age"),
        gender: sessionStorage.getItem("user_gender"),
        symptoms: (sessionStorage.getItem("Selected")).split(","),
        disease: "Heart Disease",
        medicine: disease>0.5?medicine[parseInt(sessionStorage.getItem("Disease"))].Medicine:"No Medication",
        country:country,
        city:city,
        latitude:lati,
        longitude:long,
        region:region,
        createdAt: Timestamp.now()
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

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
          const user = result.user;
          setuser_uid(user.uid)
          fetch('https://api.ipregistry.co/?key=tryout')
            .then(function (response) {
              return response.json();
            })
            .then(function (payload) {
              // console.log(payload.location.country.name + ', ' + payload.location.city);
              setcountry(payload.location.country.name )
              setcity(payload.location.city)
              setlati(payload.location.latitude)
              setlong(payload.location.longitude)
              setregion(payload.location.region.name)
            });


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
  const [disease, setDisease] = useState(-1)

  useEffect(() => {
    setDisease(location.state.disease)
  }, [location.state.disease])
  const chartData3_2 = {
    chart: {
        id: "Symptomsmonthlydatadonut",
        type: "donut"
    },
    labels: ['Carbohydrate','Protein',
    'Iron',
    'Fat',
    'Calcium',
    'Sodium'],
    chartOptions: {
        labels: ['Carbohydrate','Protein',
        'Iron',
        'Fat',
        'Calcium',
        'Sodium'],
    },

    legend: {
        // position: '',
        // width: 400
        // position: 'top',
        fontSize: '16px',
        fontFamily: "Calibre R",
        horizontalAlign: 'center',
        position: `bottom`,
        labels: {
            colors: "var(--text-color)",
        }
    },
    series: [disease>0.5?diet[0]["Carbohydrate"]:diet[1]["Carbohydrate"],
    disease>0.5?diet[0]["Protein"]:diet[1]["Protein"],
    disease>0.5?diet[0]["Iron"]:diet[1]["Iron"],
    disease>0.5?diet[0]["Fat"]:diet[1]["Fat"],
    disease>0.5?diet[0]["Calcium"]:diet[1]["Calcium"],
    disease>0.5?diet[0]["Sodium"]:diet[1]["Sodium"]],
    title: {
        // text: "Overall Symptoms",
        align: 'left',
        margin: 10,
        offsetX: 10,
        offsetY: -5,
        floating: false,
        style: {
            fontSize: '24px',
            fontWeight: 'bold',
            fontFamily: "Calibre R",
            color: 'var(--heading-color)'
        },
    }
};

  const handleSubmit = () => {
    Swal.fire({
      text: 'Do you want to continue Rechecking of other Disease(s)?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      icon: "question",
    }).then((result) => {
      if (result.isConfirmed) {
        add_data()
        history.push("/form/disease")
      }
      else{
        add_data()
        Swal.fire({
          title: 'Thank You',
          showCancelButton: true,
          cancelButtonText:'<svg style="margin-bottom:4px;margin-right:2px;" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1.2em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M685.4 354.8c0-4.4-3.6-8-8-8l-66 .3L512 465.6l-99.3-118.4-66.1-.3c-4.4 0-8 3.5-8 8 0 1.9.7 3.7 1.9 5.2l130.1 155L340.5 670a8.32 8.32 0 0 0-1.9 5.2c0 4.4 3.6 8 8 8l66.1-.3L512 564.4l99.3 118.4 66 .3c4.4 0 8-3.5 8-8 0-1.9-.7-3.7-1.9-5.2L553.5 515l130.1-155c1.2-1.4 1.8-3.3 1.8-5.2z"></path><path d="M512 65C264.6 65 64 265.6 64 513s200.6 448 448 448 448-200.6 448-448S759.4 65 512 65zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path></svg>Close',
          confirmButtonText: '<a href="https://docs.google.com/forms/d/e/1FAIpQLSdqZpTmO4AV9LjyzVWImxIca0uckuR1f7bAJQWErWureyrH0Q/viewform?usp=sf_link" target="_blank" style="color:#fff"><svg style="margin-bottom:2px;margin-right:2px;" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.2em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17l-.59.59-.58.58V4h16v12zm-9-4h2v2h-2zm0-6h2v4h-2z"></path></svg>Feedback</a>',
          icon: "success",
        })
        history.push("/")
      }
    })
  }
  const handleBack = () => {
    history.push({ pathname: "/heartform/disease", state: { selected: location.state.selected } })
  }

  return (
    <section className='d-flex align-items-start form gray-bg' style={{ minHeight: window.innerWidth > 800 ? "78vh" : "76vh", paddingTop: "30px", flexDirection: 'column' }}>
      <div className="container" >
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: .25 }}
        >
          <h1 className='display-5' style={{ fontFamily: "Calibre M", lineHeight: 1.1, color: "var(--heading-color)", marginBottom: "-2px", letterSpacing: "-0.2px", marginTop: window.innerWidth > 700 ? "5px" : "10px" }}>Food Diet</h1>
          <div className='pos-rel' style={{ paddingBottom: "20px" }}>
            <img src={img2} alt="" style={{ filter: "grayScale(1) opacity(0.6) drop-shadow(0 0 0 var(--first-color))" }} />
          </div>
          <div className="row  mb-5  align-items-center ">
            <div className="col-xl-6 col-lg-6 mb-4 mb-md-0" style={{ paddingBottom: "20px" }}>
             <div className='table-responsive-sm'>
              <table className="table table-sm ">
                <thead>
                  <tr className="fs-2" style={{ fontFamily: "Calibre M" ,color: "var(--heading-color)"}}>
                    <th scope="col">#</th>
                    <th scope="col">Nutrients</th>
                    <th scope="col">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className='fs-4' style={{ fontFamily: "Calibre R" ,color: "var(--text-color)"}}>
                    <th scope="row">1</th>
                    <td>Carbohydrate</td>
                    <td>{disease>0.5?diet[0]["Carbohydrate"]:diet[1]["Carbohydrate"]}g</td>
                  </tr>
                  <tr className='fs-4' style={{ fontFamily: "Calibre R" ,color: "var(--text-color)"}}>
                    <th scope="row">2</th>
                    <td>Protein</td>
                    <td>{disease>0.5?diet[0]["Protein"]:diet[1]["Protein"]}g</td>
                  </tr>
                  <tr className='fs-4' style={{ fontFamily: "Calibre R" ,color: "var(--text-color)"}}>
                    <th scope="row">3</th>
                    <td>Iron</td>
                    <td>{disease>0.5?diet[0]["Iron"]:diet[1]["Iron"]}g</td>
                  </tr>
                  <tr className='fs-4' style={{ fontFamily: "Calibre R" ,color: "var(--text-color)"}}>
                    <th scope="row">4</th>
                    <td>Fat</td>
                    <td>{disease>0.5?diet[0]["Fat"]:diet[1]["Fat"]}g</td>
                  </tr>
                  <tr className='fs-4' style={{ fontFamily: "Calibre R" ,color: "var(--text-color)"}}>
                    <th scope="row">5</th>
                    <td>Calcium</td>
                    <td>{disease>0.5?diet[0]["Calcium"]:diet[1]["Calcium"]}g</td>
                  </tr>
                  <tr className='fs-4' style={{ fontFamily: "Calibre R" ,color: "var(--text-color)"}}>
                    <th scope="row">6</th>
                    <td>Sodium</td>
                    <td>{disease>0.5?diet[0]["Sodium"]:diet[1]["Sodium"]}g</td>
                  </tr>
                  <tr className='fs-4' style={{ fontFamily: "Calibre R" ,color: "var(--text-color)"}}>
                    <th scope="row">7</th>
                    <td>Total Kcals per day</td>
                    <td>{disease>0.5?diet[0]["Total Kcals per day"]:diet[1]["Total Kcals per day"]} kcal</td>
                  </tr>
                </tbody>
              </table>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 mb-4 mb-md-0" style={{ paddingBottom: "20px" }}>
             
            <ReactApexChart options={chartData3_2} series={chartData3_2.series} type="donut"  />
            </div>
          </div>
          <div className="row  mb-9  align-items-start ">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-4 mb-md-0" style={{ paddingBottom: "20px" }}>
              <h1 className='display-6' style={{ fontFamily: "Calibre M", lineHeight: 1.1, color: "var(--heading-color)", marginBottom: "-2px", letterSpacing: "-0.2px", marginTop: window.innerWidth > 700 ? "5px" : "10px" }}>Food To Eat</h1>
              <div className='pos-rel' style={{ paddingBottom: "15px" }}>
                <img src={img2} alt="" style={{ filter: "grayScale(1) opacity(0.6) drop-shadow(0 0 0 var(--first-color))" }} />
              </div>
              <div className='fs-4 selected2' style={{ fontFamily: "Calibre R", paddingLeft: "10px", paddingRight: "25px" }}>
                <li style={{ listStyleType: "square", fontFamily: "Calibre R", color: "var(--text-color)" }}>{disease > 0.5 ? foodToEat[0]["food1"] : foodToEat[1]["food1"]}</li>
                <li style={{ listStyleType: "square", fontFamily: "Calibre R", color: "var(--text-color)" }}>{disease > 0.5 ? foodToEat[0]["food2"] : foodToEat[1]["food2"]}</li>
                <li style={{ listStyleType: "square", fontFamily: "Calibre R", color: "var(--text-color)" }}>{disease > 0.5 ? foodToEat[0]["food3"] : foodToEat[1]["food3"]}</li>
                <li style={{ listStyleType: "square", fontFamily: "Calibre R", color: "var(--text-color)" }}>{disease > 0.5 ? foodToEat[0]["food4"] : foodToEat[1]["food4"]}</li>
                <li style={{ listStyleType: "square", fontFamily: "Calibre R", color: "var(--text-color)" }}>{disease > 0.5 ? foodToEat[0]["food5"] : foodToEat[1]["food5"]}</li>
                <li style={{ listStyleType: "square", fontFamily: "Calibre R", color: "var(--text-color)" }}>{disease > 0.5 ? foodToEat[0]["food6"] : foodToEat[1]["food6"]}</li>
              </div>

            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-4 mb-md-0">
              <h1 className='display-6' style={{ fontFamily: "Calibre M", lineHeight: 1.1, color: "var(--heading-color)", marginBottom: "-2px", letterSpacing: "-0.2px", marginTop: window.innerWidth > 700 ? "5px" : "10px" }}>Food To Avoid</h1>
              <div className='pos-rel' style={{ paddingBottom: "15px" }}>
                <img src={img2} alt="" style={{ filter: "grayScale(1) opacity(0.6) drop-shadow(0 0 0 var(--first-color))" }} />
              </div>
              <div className='fs-4 selected2' style={{ fontFamily: "Calibre R", paddingLeft: "10px", paddingRight: "25px" }}>
                <li style={{ listStyleType: "square", fontFamily: "Calibre R", color: "var(--text-color)" }}>{disease > 0.5 ? foodToAvoid[0]["food1"] : foodToAvoid[1]["food1"]}</li>
                <li style={{ listStyleType: "square", fontFamily: "Calibre R", color: "var(--text-color)" }}>{disease > 0.5 ? foodToAvoid[0]["food2"] : foodToAvoid[1]["food2"]}</li>
                <li style={{ listStyleType: "square", fontFamily: "Calibre R", color: "var(--text-color)" }}>{disease > 0.5 ? foodToAvoid[0]["food3"] : foodToAvoid[1]["food3"]}</li>
                <li style={{ listStyleType: "square", fontFamily: "Calibre R", color: "var(--text-color)" }}>{disease > 0.5 ? foodToAvoid[0]["food4"] : foodToAvoid[1]["food4"]}</li>
                <li style={{ listStyleType: "square", fontFamily: "Calibre R", color: "var(--text-color)" }}>{disease > 0.5 ? foodToAvoid[0]["food5"] : foodToAvoid[1]["food5"]}</li>
                <li style={{ listStyleType: "square", fontFamily: "Calibre R", color: "var(--text-color)" }}>{disease > 0.5 ? foodToAvoid[0]["food6"] : foodToAvoid[1]["food6"]}</li>

              </div>
            </div>
          </div>
        </motion.div>
        <div className='' style={{ position: "absolute", bottom: 0, paddingBottom: "0.5rem" }}>
          <button onClick={handleBack} type="button" className="btn btn-primary rounded-2 ms-auto me-auto me-4 my-4 btn_hover gray-bg" data-mdb-ripple-color="var(--first-color)" style={{ borderColor: "var(--first-color)", padding: "9px 20px", fontSize: "14px", marginTop: "20px", color: 'var(--first-color)', fontFamily: 'SF Mono' }}><BiChevronLeft size={24} style={{ verticalAlign: "-7.5px" }} />  Back</button>
        </div>
        <div className='' style={{ paddingRight: "3rem", position: "absolute", bottom: 0, right: 0, paddingBottom: "0.5rem" }}>
          <button onClick={handleSubmit} type="button" className="btn btn-primary rounded-2 ms-auto me-auto me-4 my-4 btn_hover" data-mdb-ripple-color="var(--first-color)" style={{ background: "var(--first-color) var(--mdb-gradient)", borderColor: "var(--first-color)", padding: "9px 20px", fontSize: "14px", marginTop: "20px", color: '#FFF', fontFamily: 'SF Mono' }}>Next <BiChevronRight size={24} style={{ verticalAlign: "-7.5px" }} /> </button>
        </div>
      </div>
    </section>
  )
}
