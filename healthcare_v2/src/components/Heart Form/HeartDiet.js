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
          <div className="row  mb-5  align-items-start ">
            <div className="col-xl-6 col-lg-7 mb-4 mb-md-0" style={{ paddingBottom: "20px" }}>
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
            <div className="col-xl-6 col-lg-7 mb-4 mb-md-0" style={{ paddingBottom: "20px" }}>
             
            <ReactApexChart options={chartData3_2} series={chartData3_2.series} type="donut"  />
            </div>
          </div>
          <div className="row  mb-9  align-items-start ">
            <div className="col-xl-6 col-lg-7 mb-4 mb-md-0" style={{ paddingBottom: "20px" }}>
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
            <div className="col-xl-6 col-lg-7 mb-4 mb-md-0">
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
