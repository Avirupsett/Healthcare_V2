import React from 'react'
import img from '../assets/section-back-icon.png'
import img2 from '../assets/section-title-line.png'
import './Department.css'
import { motion } from "framer-motion"

export default function Department() {
  return (
    <section className='servcies-area gray-bg' id="depart" style={{ minHeight: "100vh",paddingTop:"115px",paddingBottom:"90px",marginTop:"-10px" }}>
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
        <div className='row'>
            <div className='col-xl-8 offset-xl-2 col-lg-10 offset-lg-1'>
                <div className='section-title text-center pos-rel' style={{marginBottom:"75px"}}>
                    <div className='section-icon'>
                        <img className='section-back-icon' src={img} alt="" style={{filter:localStorage.getItem("DarkMode")==="on"?"brightness(0.25)":""}}/>
                    </div>
                    <div className='pos-rel'>
                        <h5 className='fs-4 fw-bolder' style={{marginBottom: "28px",color:"var(--first-color)",fontFamily:"SF Mono"}}>WorkFlow</h5>
                        <h1 className='display-2' style={{marginBottom:"18px",color:"var(--heading-color)",fontFamily:"Calibre S",lineHeight:1.1,letterSpacing:'-2px'}}>Managed Your <br/>Heathcare Services</h1>
                    </div>
                    <div className='pos-rel'>
                        <img src={img2} alt="" style={{filter:"grayScale(1) opacity(0.6) drop-shadow(0 0 0 var(--first-color))"}}/>
                    </div>
                </div>
            </div>
            </div>
        <div className='row'>
            <div className='col-xl-4 col-lg-6 col-md-6'>
                <div className='box text-center'>
                    <div className="thumb">
                        <img style={{filter:"grayScale(1) opacity(0.8) drop-shadow(0 0 0 var(--first-color))"}} src="	https://themepure.net/template/medidove-prv/medidove/img/services/service1.png" alt="" />
                    </div>
                    <div className="content">
                        <h3 className='fs-1' style={{color:"var(--heading-color)"}}>Symptoms</h3>
                        <p className='fs-6' style={{color:"var(--text-color)"}}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint, voluptas!</p>
                        {/* <a className='fs-6' href='/predict'>Click here</a> */}
                    </div>

                </div>
            </div>
            <div className='col-xl-4 col-lg-6 col-md-6'>
                <div className='box text-center'>
                    <div className="thumb">
                        <img style={{filter:"grayScale(1) opacity(0.8) drop-shadow(0 0 0 var(--first-color))"}} src="	https://themepure.net/template/medidove-prv/medidove/img/services/service4.png" alt="" />
                    </div>
                    <div className="content">
                        <h3 className='fs-1' style={{color:"var(--heading-color)"}}>Prediction</h3>
                        <p className='fs-6' style={{color:"var(--text-color)"}}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint, voluptas!</p>
                        {/* <a className='fs-6' href='/predict'>Click here</a> */}
                    </div>

                </div>
            </div>
            <div className='col-xl-4 col-lg-6 col-md-6'>
                <div className='box text-center'>
                    <div className="thumb">
                        <img style={{filter:"grayScale(1) opacity(0.8) drop-shadow(0 0 0 var(--first-color))"}} src="	https://themepure.net/template/medidove-prv/medidove/img/services/service6.png" alt="" />
                    </div>
                    <div className="content">
                        <h3 className='fs-1' style={{color:"var(--heading-color)"}}>Medication</h3>
                        <p className='fs-6' style={{color:"var(--text-color)"}}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint, voluptas!</p>
                        {/* <a className='fs-6' href='/predict'>Click here</a> */}
                    </div>

                </div>
            </div>
        </div>
        </motion.div>
    </section>
  )
}
