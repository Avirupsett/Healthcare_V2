import React from 'react'
import './Team.css'
// import img from '../assets/section-back-icon.png'
import img2 from '../assets/section-title-line.png'
import { motion } from "framer-motion"
import aritra from "../assets/Aritra.jpeg"
import priyanka from "../assets/Priyanka.jpeg"
import debojyoti from "../assets/Debojyoti.jpeg"
import avirup from "../assets/Avirup.png"

export default function Team() {
    return (
        <section className='servcies-area'  style={{ minHeight: "100vh", paddingTop: "115px", paddingBottom: "90px", marginTop: "-10px" }}>
            <motion.div className='container' id="group"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ease:"easeInOut", duration: .75 }}
            variants={{
              visible: { opacity: [0,1], y: [25, 0] },
              hidden: { opacity: 0}
            }}
            >
                <div className='row about'>
                    <div className='col-xl-6 col-lg-7 col-md-10'>
                        <div className='section-title pos-rel' style={{ marginBottom: "75px" }}>
                            {/* <div className='section-icon'>
                        <img className='section-back-icon' src={img} alt="" />
                    </div> */}
                            <div className='pos-rel'>
                                <h5 className='fs-4 fw-bolder' style={{ marginBottom: "28px", color: "var(--first-color)", fontFamily: "SF Mono" }}>Our Team</h5>
                                <h1 className='display-2' style={{ marginBottom: "18px", color: "var(--heading-color)", fontFamily: "Calibre S", lineHeight: 1.1, letterSpacing: '-2px' }}>A Profesional & Skilled Developer</h1>
                            </div>
                            <div className='pos-rel'>
                                <img src={img2} alt="" style={{filter:"grayScale(1) opacity(0.6) drop-shadow(0 0 0 var(--first-color))"}}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-xl-6 col-lg-6 col-md-6 pe-5'>
                        <div className='team text-center' style={{marginBottom:"60px"}}>
                        <div className='team-image pos-rel' style={{marginBottom:"45px"}}>
                            <img src={avirup} alt="" />
                        </div>
                        <div className="team-content">
                            <h3 className='fs-2'>Avirup Sett</h3>
                            <h6 className='fs-5'>Full-Stack Developer</h6>
                        </div>
                        </div>
                    </div>
                    <div className='col-xl-6 col-lg-6 col-md-6 pe-5'>
                        <div className='team text-center' style={{marginBottom:"60px"}}>
                        <div className='team-image pos-rel' style={{marginBottom:"45px"}}>
                            <img src={debojyoti} alt="" />
                        </div>
                        <div className="team-content">
                            <h3 className='fs-2'>Debojyoti Sen</h3>
                            <h6 className='fs-5'>Data Analyst</h6>
                        </div>
                        </div>
                    </div>
                    <div className='col-xl-6 col-lg-6 col-md-6 pe-5'>
                        <div className='team text-center' style={{marginBottom:"60px"}}>
                        <div className='team-image pos-rel' style={{marginBottom:"45px"}}>
                            <img src={priyanka} alt="" />
                        </div>
                        <div className="team-content">
                            <h3 className='fs-2'>Priyanka Saha</h3>
                            <h6 className='fs-5'>Data Analyst</h6>
                        </div>
                        </div>
                    </div>
                    <div className='col-xl-6 col-lg-6 col-md-6 pe-5'>
                        <div className='team text-center' style={{marginBottom:"60px"}}>
                        <div className='team-image pos-rel' style={{marginBottom:"45px"}}>
                            <img src={aritra} alt="" />
                        </div>
                        <div className="team-content">
                            <h3 className='fs-2'>Aritra Das</h3>
                            <h6 className='fs-5'>Web Developer</h6>
                        </div>
                        </div>
                    </div>
                </div>

            </motion.div>
        </section>
    )
}
