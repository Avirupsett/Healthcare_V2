import React, { useEffect, useState } from 'react'
import img2 from '../../assets/section-title-line.png'
import img from '../../assets/RAPIDCARE.png'
import { BiChevronRight, BiChevronLeft } from 'react-icons/bi';
import { Link, useHistory } from 'react-router-dom';
import precautions from './disease_precaution_1.json'
import medicine from './disease_medicine.json'
import encoded from './disease_description_encoded.json'
import diet from './Deases_Diet.json'
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
  const [lati, setlati] = useState("")
  const [long, setlong] = useState("")
  const [isloading, setisloading] = useState(0)
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
              setcountry(payload.location.country.name)
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
  const doc = new jsPDF();
  const make_pdf = () => {
    setisloading(1)
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

  }
  const add_data = async () => {
    try {
      setisloading(1)
      const docRef = await addDoc(collection(db, "users"), {
        uid: user_uid,
        name: sessionStorage.getItem("user_name"),
        email: sessionStorage.getItem("user_email"),
        dob: sessionStorage.getItem("user_age"),
        gender: sessionStorage.getItem("user_gender"),
        symptoms: (sessionStorage.getItem("Selected")).split(","),
        disease: encoded[parseInt(sessionStorage.getItem("Disease"))].Disease,
        medicine: medicine[parseInt(sessionStorage.getItem("Disease"))].Medicine,
        country: country,
        city: city,
        latitude: lati,
        longitude: long,
        region: region,
        createdAt: Timestamp.now()
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  const history = useHistory()
  const HandleFinish = () => {
    setisloading(1)
    add_data()
    Swal.fire({
      text: 'Do you want to Download the Prescription?',
      showCancelButton: true,
      confirmButtonText: '<svg style="margin-bottom:4px;margin-right:2px;" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1.2em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>Download',
      icon: "question",
    }).then((result) => {
      make_pdf()
      setisloading(0)
      if (result.isConfirmed) {
        // let timerInterval
        // Swal.fire("Downloaded Successfully", "Thank You for using our Service", "success")
        Swal.fire({
          title: "Downloaded Successfully",
          text: 'Thank You for using our Service',
          showCancelButton: true,
          cancelButtonText: '<svg style="margin-bottom:4px;margin-right:2px;" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1.2em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M685.4 354.8c0-4.4-3.6-8-8-8l-66 .3L512 465.6l-99.3-118.4-66.1-.3c-4.4 0-8 3.5-8 8 0 1.9.7 3.7 1.9 5.2l130.1 155L340.5 670a8.32 8.32 0 0 0-1.9 5.2c0 4.4 3.6 8 8 8l66.1-.3L512 564.4l99.3 118.4 66 .3c4.4 0 8-3.5 8-8 0-1.9-.7-3.7-1.9-5.2L553.5 515l130.1-155c1.2-1.4 1.8-3.3 1.8-5.2z"></path><path d="M512 65C264.6 65 64 265.6 64 513s200.6 448 448 448 448-200.6 448-448S759.4 65 512 65zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path></svg>Close',
          confirmButtonText: '<a href="https://docs.google.com/forms/d/e/1FAIpQLSdqZpTmO4AV9LjyzVWImxIca0uckuR1f7bAJQWErWureyrH0Q/viewform?usp=sf_link" target="_blank" style="color:#fff"><svg style="margin-bottom:2px;margin-right:2px;" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.2em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17l-.59.59-.58.58V4h16v12zm-9-4h2v2h-2zm0-6h2v4h-2z"></path></svg>Feedback</a>',
          icon: "success",
        })
        // Swal.fire({
        //   title: 'Downloading....',
        //   html: 'Please Wait For few seconds',
        //   timer: 2000,
        //   timerProgressBar: true,
        //   // didOpen: () => {
        //   //   Swal.showLoading()
        //   //   // const b = Swal.getHtmlContainer().querySelector('b')
        //   //   // timerInterval = setInterval(() => {
        //   //   //   b.textContent = Swal.getTimerLeft()
        //   //   // }, 100)
        //   // },
        //   willOpen:()=>{
        //     Swal.showLoading(Swal.getConfirmButton())
        //   },
        //   willClose: () => {
        //     // clearInterval(timerInterval)
        //     Swal.fire("Downloaded Successfully", "Thank You for using our Service", "success")
        //   }
        // }).then((result) => {
        //   /* Read more about handling dismissals below */
        //   if (result.dismiss === Swal.DismissReason.timer) {
        //     // console.log('I was closed by the timer')
        //   }
        // })

        doc.save(`${sessionStorage.getItem("user_name")}_Prescription.pdf`);

        // Swal.fire("Downloaded Successfully", "Thank You for using our Service", "success")
        history.push("/")
      } else {
        // Swal.fire('Thank You', '', 'success')
        Swal.fire({
          title: 'Thank You',
          showCancelButton: true,
          cancelButtonText: '<svg style="margin-bottom:4px;margin-right:2px;" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1.2em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M685.4 354.8c0-4.4-3.6-8-8-8l-66 .3L512 465.6l-99.3-118.4-66.1-.3c-4.4 0-8 3.5-8 8 0 1.9.7 3.7 1.9 5.2l130.1 155L340.5 670a8.32 8.32 0 0 0-1.9 5.2c0 4.4 3.6 8 8 8l66.1-.3L512 564.4l99.3 118.4 66 .3c4.4 0 8-3.5 8-8 0-1.9-.7-3.7-1.9-5.2L553.5 515l130.1-155c1.2-1.4 1.8-3.3 1.8-5.2z"></path><path d="M512 65C264.6 65 64 265.6 64 513s200.6 448 448 448 448-200.6 448-448S759.4 65 512 65zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path></svg>Close',
          confirmButtonText: '<a href="https://docs.google.com/forms/d/e/1FAIpQLSdqZpTmO4AV9LjyzVWImxIca0uckuR1f7bAJQWErWureyrH0Q/viewform?usp=sf_link" target="_blank" style="color:#fff"><svg style="margin-bottom:2px;margin-right:2px;" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.2em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17l-.59.59-.58.58V4h16v12zm-9-4h2v2h-2zm0-6h2v4h-2z"></path></svg>Feedback</a>',
          icon: "success",
        })
        history.push("/")
      }
    })

  }

  return (
    <section id="medication" className='d-flex align-items-start form gray-bg' style={{ minHeight: window.innerWidth > 800 ? "78vh" : "77vh", paddingTop: "30px", flexDirection: 'column' }}>
      <div className="container-fluid" >
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: .5 }}
        >
           <h1 className='display-5' style={{ fontFamily: "Calibre M", lineHeight: 1.1, color: "var(--heading-color)", marginBottom: "-2px", letterSpacing: "-0.2px", marginTop: window.innerWidth > 700 ? "5px" : "10px" }}>Advisories For {encoded[parseInt(sessionStorage.getItem("Disease"))].Disease}</h1>
        <div className='pos-rel' style={{ paddingBottom: "24px" }}>
          <img src={img2} alt="" style={{filter:"grayScale(1) opacity(0.6) drop-shadow(0 0 0 var(--first-color))"}}/>
        </div>
          <div className="row  mb-5 me-lg-5">

            <div className="col-xl-6 col-lg-6 " >
              <div className='mbox' >

                <h1 className='display-6' style={{ fontFamily: "Calibre M", lineHeight: 1.1, color: "var(--heading-color)", marginBottom: "-2px", letterSpacing: "-0.2px" }}>Food Diet</h1>
                <div className='pos-rel' style={{ paddingBottom: "15px" }}>
                  <img src={img2} alt="" style={{ filter: "grayScale(1) opacity(0.6) drop-shadow(0 0 0 var(--first-color))" }} />
                </div>
                <div className='fs-4 selected2' style={{ fontFamily: "Calibre R", paddingLeft: "15px", paddingRight: "0px" }}>
                  <ul>
                    <li style={{ listStyleType: "square", fontFamily: "Calibre R", color: "var(--text-color)" }}>{diet[parseInt(sessionStorage.getItem("Disease"))].Diet}</li>
                    <li style={{ listStyleType: "square", fontFamily: "Calibre R", color: "var(--text-color)" }}>{diet[parseInt(sessionStorage.getItem("Disease"))].Diet1}</li>
                    <li style={{ listStyleType: "square", fontFamily: "Calibre R", color: "var(--text-color)" }}>{diet[parseInt(sessionStorage.getItem("Disease"))].Diet2}</li>
                    <li style={{ listStyleType: "square", fontFamily: "Calibre R", color: "var(--text-color)" }}>{diet[parseInt(sessionStorage.getItem("Disease"))].Diet3}</li>
                  </ul>
                </div>
              </div>

            </div>
            <div className='col-xl-6 col-lg-6  mb-4'>
            <div className="col" >
              <div className='mbox' >

                <h1 className='display-6' style={{ fontFamily: "Calibre M", lineHeight: 1.1, color: "var(--heading-color)", marginBottom: "-2px", letterSpacing: "-0.2px" }}>Precautions</h1>
                <div className='pos-rel' style={{ paddingBottom: "15px" }}>
                  <img src={img2} alt="" style={{ filter: "grayScale(1) opacity(0.6) drop-shadow(0 0 0 var(--first-color))" }} />
                </div>
                <div className='fs-4 selected2' style={{ fontFamily: "Calibre R", paddingLeft: "15px", paddingRight: "0px" }}>
                  <ul>
                    <li style={{ listStyleType: "square", fontFamily: "Calibre R", color: "var(--text-color)" }}>{precautions[parseInt(sessionStorage.getItem("Disease"))].Symptom_Precaution_0}</li>
                    <li style={{ listStyleType: "square", fontFamily: "Calibre R", color: "var(--text-color)" }}>{precautions[parseInt(sessionStorage.getItem("Disease"))].Symptom_Precaution_1}</li>
                    <li style={{ listStyleType: "square", fontFamily: "Calibre R", color: "var(--text-color)" }}>{precautions[parseInt(sessionStorage.getItem("Disease"))].Symptom_Precaution_2}</li>
                    <li style={{ listStyleType: "square", fontFamily: "Calibre R", color: "var(--text-color)" }}>{precautions[parseInt(sessionStorage.getItem("Disease"))].Symptom_Precaution_3}</li>
                  </ul>
                </div>
              </div>

            </div>

            <div className="col" >
              <div className='mbox' >

                <h1 className='display-6' style={{ fontFamily: "Calibre M", lineHeight: 1.1, color: "var(--heading-color)", marginBottom: "-2px", letterSpacing: "-0.2px" }}>Medication</h1>

                <div className='pos-rel' style={{ paddingBottom: "15px" }}>
                  <img src={img2} alt="" style={{ filter: "grayScale(1) opacity(0.6) drop-shadow(0 0 0 var(--first-color))" }} />
                </div>
                <div className='fs-4 selected2' style={{ fontFamily: "Calibre R", paddingLeft: "15px", paddingRight: "0px" }}>
                  <ul>
                    <li style={{ listStyleType: "square", fontFamily: "Calibre R", color: "var(--text-color)" }}>{medicine[parseInt(sessionStorage.getItem("Disease"))].Medicine}</li>
                  </ul>
                </div>
              </div>
            </div>
            </div>
          </div>
        </motion.div>
        <div className='' style={{ position: "absolute", bottom: 0, paddingBottom: "0.5rem" }}>
          <Link to="/form/disease"><button type="button" className="btn btn-primary rounded-2 ms-auto me-auto me-4 my-4 btn_hover gray-bg" data-mdb-ripple-color="var(--first-color)" style={{ borderColor: "var(--first-color)", padding: "9px 20px", fontSize: "14px", marginTop: "20px", color: 'var(--first-color)', fontFamily: 'SF Mono' }}><BiChevronLeft size={24} style={{ verticalAlign: "-7.5px" }} />  Back</button></Link>
        </div>
        <div className='' style={{ paddingRight: "3rem", position: "absolute", bottom: 0, right: 0, paddingBottom: "0.5rem" }}>
          <button onClick={HandleFinish} type="button" className="btn btn-primary rounded-2 ms-auto me-auto me-4 my-4 btn_hover" data-mdb-ripple-color="var(--first-color)" style={{ background: "var(--first-color) var(--mdb-gradient)", borderColor: "var(--first-color)", padding: "9px 20px", fontSize: "14px", marginTop: "20px", color: '#FFF', fontFamily: 'SF Mono' }}>{isloading === 1 ? <span className="spinner-border  spinner-border-sm me-2" role="status" aria-hidden="true" ></span> : ''}
            Finish <BiChevronRight size={24} style={{ verticalAlign: "-7.5px" }} /> </button>
        </div>

      </div>
    </section>
  )
}
