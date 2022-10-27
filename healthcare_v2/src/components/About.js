import React from 'react'
import img from '../assets/aboutlogo_blue.png'
import './About.css'
import { motion } from "framer-motion"

export default function About() {
    return (
        <section className='d-flex align-items-center' id="info" style={{ minHeight: "120vh"}}>
            <motion.div className='container' 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ease:"easeInOut", duration: .75 }}
            variants={{
              visible: { opacity: [0,1], y: [25, 0] },
              hidden: { opacity: 0}
            }}
            >
            <div className="row  mb-5 flex-lg-row-reverse align-items-center about">
                <div className="col-xl-6 col-lg-5 mb-4 mb-md-0 w_image pe-0">
                    <img src={img} className="mb-1" alt="" style={{ width: "60%", marginLeft: '120px',filter:"grayScale(1) opacity(0.5) drop-shadow(0 0 0 var(--first-color))", border: '2px solid var(--first-color)', borderRadius: '50%', padding: '25px' }} data-builder-edit="image" data-builder-name="image1" aria-controls="#picker-editor" />
                </div>
                <div className="col-xl-6 col-lg-7 gx-md-1 mb-4 mb-md-0 ">
                    <div style={{marginBottom:"20px"}}>
                        <h5 className='fs-4 fw-bolder' style={{marginBottom:"27px",color:"var(--first-color)",fontFamily:"SF Mono"}}>About</h5>
                        <h1 className='display-2' style={{color:"var(--heading-color)",fontFamily:"Calibre S",lineHeight:1.1,letterSpacing:'-2px'}}>A Brief Idea About the Project</h1>
                    </div>
                    <p className='pa-1' style={{color:"var(--text-color)",fontSize:"18px",fontFamily:"Calibre R"}}>The project <strong>Efficient Automated Multiple Disease Diagnosis System (EAMDDS)</strong> aims to implement a robust machine learning model that can efficiently predict the disease of a human, based on the symptoms that he/she posses. An end-to-end process is used where people must enter their details in the web-portal and submit the data. The real-time processing takes place, and the risk is predicted within a few seconds.
                    </p>
                    <p className='pa-1' style={{color:"var(--text-color)",fontSize:"18px",fontFamily:"Calibre R",marginTop:"10px"}}>
                    Nowadays with the increasing number of patients and diseases each year, the medical system is becoming overloaded and overpriced in many countries. The prosperous treatment is sometimes attributed to right and correct identification which is solved by our project <strong>EAMDDS</strong>. We've additionally tried to signify and visualized the results of our study and this project.
                    </p>
                </div>
                </div>
            </motion.div>
        </section>
    )
}
