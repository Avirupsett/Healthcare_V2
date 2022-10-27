import React, { useEffect, useState } from 'react'
import img2 from '../../assets/section-title-line.png'
import img from '../../assets/RAPIDCARE.png'
import { BiChevronRight, BiChevronLeft } from 'react-icons/bi';
import { Link, useHistory } from 'react-router-dom';
import precautions from './disease_precaution_1.json'
import medicine from './disease_medicine.json'
import encoded from './disease_description_encoded.json'
import { motion } from 'framer-motion';
import Swal from 'sweetalert2'
import { jsPDF } from "jspdf";
import { initializeApp } from "firebase/app";
import { FacebookAuthProvider, getAuth } from "firebase/auth";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function Medication() {
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
  useEffect(() => {
    authenticate()
  })
  let user
  const [auth, setauth] = useState(0)
  const [user_uid, setuser_uid] = useState(0)
  const [country, setcountry] = useState("")
  const [city, setcity] = useState("")
  const [region, setregion] = useState("")
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
          user = result.user;
          setuser_uid(user.uid)
          fetch('https://api.ipregistry.co/?key=tryout')
            .then(function (response) {
              return response.json();
            })
            .then(function (payload) {
              // console.log(payload.location.country.name + ', ' + payload.location.city);
              setcountry(payload.location.country.name )
              setcity(payload.location.city)
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
  const add_data = async () => {
    try {

      const docRef = await addDoc(collection(db, "users"), {
        uid: user_uid,
        name: sessionStorage.getItem("user_name"),
        email: sessionStorage.getItem("user_email"),
        dob: sessionStorage.getItem("user_age"),
        gender: sessionStorage.getItem("user_gender"),
        symptoms: (sessionStorage.getItem("Selected")).split(","),
        disease: encoded[parseInt(sessionStorage.getItem("Disease"))].Disease,
        medicine: medicine[parseInt(sessionStorage.getItem("Disease"))].Medicine,
        country:country,
        city:city,
        region:region,
        createdAt: Timestamp.now()
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  const history = useHistory()
  const HandleFinish = () => {
    add_data()
    Swal.fire({
      text: 'Do you want to Download the Prescription?',
      showCancelButton: true,
      confirmButtonText: 'Download',
      icon: "question",
    }).then((result) => {

      if (result.isConfirmed) {
        // let timerInterval
        Swal.fire({
          title: 'Downloading....',
          html: 'Please Wait For few seconds',
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading()
            // const b = Swal.getHtmlContainer().querySelector('b')
            // timerInterval = setInterval(() => {
            //   b.textContent = Swal.getTimerLeft()
            // }, 100)
          },
          willClose: () => {
            // clearInterval(timerInterval)
            Swal.fire("Downloaded Successfully", "Thank You for using our Service", "success")
          }
        }).then((result) => {
          /* Read more about handling dismissals below */
          if (result.dismiss === Swal.DismissReason.timer) {
            // console.log('I was closed by the timer')
          }
        })
        const doc = new jsPDF();
        const selected = (sessionStorage.getItem("Selected")).split(",")
        var width = doc.internal.pageSize.getWidth();
        var height = doc.internal.pageSize.getHeight();
        doc.addImage(img, 'png', 0, 0, width, height)

        doc.setFontSize(18)
        doc.setFont('times', 'bold')
        doc.setTextColor(185, 18, 18)
        doc.setDrawColor(185, 18, 18)
        doc.text("PATIENT DETAILS", 11, 60)
        doc.line(11, 64, width - 12, 64)

        doc.setFont('times', 'normal')
        doc.setFontSize(14)
        doc.setTextColor(0, 0, 0)
        doc.text(`Name : ${sessionStorage.getItem("user_name")}`, 12, 72);
        doc.text(`Email : ${sessionStorage.getItem("user_email")}`, 12, 81);
        doc.text(`Date of Birth : ${sessionStorage.getItem("user_age")}`, 12, 90);
        doc.text(`Gender : ${sessionStorage.getItem("user_gender")}`, 12, 99);

        doc.setFontSize(18)
        doc.setFont('times', 'bold')
        doc.setTextColor(185, 18, 18)
        doc.text("SYMPTOMS", 11, 114)
        doc.line(11, 118, width - 12, 118)
        doc.setFontSize(14)
        doc.setFont('times', 'normal')
        doc.setTextColor(0, 0, 0)
        let y = 117
        selected.map((sym) => {
          y = y + 9
          if (y >= 275) {
            y = 60
            doc.addPage()
            doc.addImage(img, 'png', 0, 0, width, height)
          }
          return (
            doc.text(`• ${sym}`, 11, y)
          )
        })
        doc.setFontSize(18)
        doc.setFont('times', 'bold')
        doc.setTextColor(185, 18, 18)
        if (y >= 275) {
          y = 60
          doc.addPage()
          doc.addImage(img, 'png', 0, 0, width, height)
        }
        doc.text("SUSPECTED DISEASE", 10, y + 15)
        doc.line(11, y + 19, width - 12, y + 19)
        y = y + 15
        doc.setFontSize(14)
        doc.setFont('times', 'normal')
        doc.setTextColor(0, 0, 0)
        doc.text(`• ${encoded[parseInt(sessionStorage.getItem("Disease"))].Disease}`, 11, y + 12)
        y = y + 12
        if (y >= 275) {
          y = 60
          doc.addPage()
          doc.addImage(img, 'png', 0, 0, width, height)
        }
        doc.setFontSize(18)
        doc.setFont('times', 'bold')
        doc.setTextColor(185, 18, 18)
        doc.text("ADVISORIES", 10, y + 15)
        doc.line(11, y + 19, width - 12, y + 19)
        y = y + 15
        doc.setFontSize(14)
        doc.setFont('times', 'normal')
        doc.setTextColor(0, 0, 0)
        doc.text(`• ${precautions[parseInt(sessionStorage.getItem("Disease"))].Symptom_Precaution_0}`, 11, y + 12)
        y = y + 12
        if (y >= 275) {
          y = 60
          doc.addPage()
          doc.addImage(img, 'png', 0, 0, width, height)
        }
        doc.text(`• ${precautions[parseInt(sessionStorage.getItem("Disease"))].Symptom_Precaution_1}`, 11, y + 9)
        y = y + 9
        if (y >= 275) {
          y = 60
          doc.addPage()
          doc.addImage(img, 'png', 0, 0, width, height)
        }
        doc.text(`• ${precautions[parseInt(sessionStorage.getItem("Disease"))].Symptom_Precaution_2}`, 11, y + 9)
        y = y + 9
        if (y >= 275) {
          y = 60
          doc.addPage()
          doc.addImage(img, 'png', 0, 0, width, height)
        }
        doc.text(`• ${precautions[parseInt(sessionStorage.getItem("Disease"))].Symptom_Precaution_3}`, 11, y + 9)
        y = y + 9
        if (y >= 275) {
          y = 60
          doc.addPage()
          doc.addImage(img, 'png', 0, 0, width, height)
        }
        doc.setFontSize(18)
        doc.setFont('times', 'bold')
        doc.setTextColor(185, 18, 18)
        doc.text("MEDICINE", 10, y + 15)
        doc.line(11, y + 19, width - 12, y + 19)
        y = y + 15
        doc.setFontSize(14)
        doc.setFont('times', 'normal')
        doc.setTextColor(0, 0, 0)
        doc.text(`• ${medicine[parseInt(sessionStorage.getItem("Disease"))].Medicine}`, 11, y + 12)
        y = y + 12
        const date = new Date();
        doc.setFontSize(10)
        doc.setFont('times', 'italic')
        doc.setTextColor(250, 250, 250)
        doc.text(`${date}`, 60, 294)
        doc.save(`${sessionStorage.getItem("user_name")}_Prescription.pdf`);

        // Swal.fire("Downloaded Successfully", "Thank You for using our Service", "success")
        history.push("/")
      } else {
        Swal.fire('Thank You', '', 'success')
        history.push("/")
      }
    })

  }

  return (
    <section id="medication" className='d-flex align-items-start form gray-bg' style={{ minHeight: window.innerWidth > 800 ? "78vh" : "77vh", paddingTop: "30px", flexDirection: 'column' }}>
      <div className="container" >
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: .5 }}
        >
          <div className="row  mb-5  align-items-start ">
            <div className="col-xl-6 col-lg-7 mb-4 mb-md-0" style={{ paddingBottom: "20px" }}>
              <h1 className='display-5' style={{ fontFamily: "Calibre M", lineHeight: 1.1, color: "var(--heading-color)", marginBottom: "-2px", letterSpacing: "-0.2px", marginTop: window.innerWidth > 700 ? "5px" : "10px" }}>Precautions</h1>
              <div className='pos-rel' style={{ paddingBottom: "24px" }}>
                <img src={img2} alt="" style={{ filter: "grayScale(1) opacity(0.6) drop-shadow(0 0 0 var(--first-color))" }} />
              </div>
              <div className='fs-4 selected2' style={{ fontFamily: "Calibre R", paddingLeft: "10px", paddingRight: "25px" }}>
                <li style={{ listStyleType: "square", fontFamily: "Calibre R", color: "var(--text-color)" }}>{precautions[parseInt(sessionStorage.getItem("Disease"))].Symptom_Precaution_0}</li>
                <li style={{ listStyleType: "square", fontFamily: "Calibre R", color: "var(--text-color)" }}>{precautions[parseInt(sessionStorage.getItem("Disease"))].Symptom_Precaution_1}</li>
                <li style={{ listStyleType: "square", fontFamily: "Calibre R", color: "var(--text-color)" }}>{precautions[parseInt(sessionStorage.getItem("Disease"))].Symptom_Precaution_2}</li>
                <li style={{ listStyleType: "square", fontFamily: "Calibre R", color: "var(--text-color)" }}>{precautions[parseInt(sessionStorage.getItem("Disease"))].Symptom_Precaution_3}</li>
              </div>

            </div>
            <div className="col-xl-6 col-lg-7 mb-4 mb-md-0">
              <h1 className='display-5' style={{ fontFamily: "Calibre M", lineHeight: 1.1, color: "var(--heading-color)", marginBottom: "-2px", letterSpacing: "-0.2px", marginTop: window.innerWidth > 700 ? "5px" : "10px" }}>Medication</h1>
              <div className='pos-rel' style={{ paddingBottom: "24px" }}>
                <img src={img2} alt="" style={{ filter: "grayScale(1) opacity(0.6) drop-shadow(0 0 0 var(--first-color))" }} />
              </div>
              <div className='fs-4 selected2' style={{ fontFamily: "Calibre R", paddingLeft: "10px", paddingRight: "25px" }}>
                <li style={{ listStyleType: "square", fontFamily: "Calibre R", color: "var(--text-color)" }}>{medicine[parseInt(sessionStorage.getItem("Disease"))].Medicine}</li>

              </div>
            </div>
          </div>
        </motion.div>
        <div className='' style={{ position: "absolute", bottom: 0, paddingBottom: "0.5rem" }}>
          <Link to="/form/disease"><button type="button" className="btn btn-primary rounded-2 ms-auto me-auto me-4 my-4 btn_hover gray-bg" data-mdb-ripple-color="var(--first-color)" style={{ borderColor: "var(--first-color)", padding: "9px 20px", fontSize: "14px", marginTop: "20px", color: 'var(--first-color)', fontFamily: 'SF Mono' }}><BiChevronLeft size={24} style={{ verticalAlign: "-7.5px" }} />  Back</button></Link>
        </div>
        <div className='' style={{ paddingRight: "3rem", position: "absolute", bottom: 0, right: 0, paddingBottom: "0.5rem" }}>
          <button onClick={HandleFinish} type="button" className="btn btn-primary rounded-2 ms-auto me-auto me-4 my-4 btn_hover" data-mdb-ripple-color="var(--first-color)" style={{ background: "var(--first-color) var(--mdb-gradient)", borderColor: "var(--first-color)", padding: "9px 20px", fontSize: "14px", marginTop: "20px", color: '#FFF', fontFamily: 'SF Mono' }}>Finish <BiChevronRight size={24} style={{ verticalAlign: "-7.5px" }} /> </button>
        </div>

      </div>
    </section>
  )
}
