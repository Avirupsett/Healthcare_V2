import React, { useLayoutEffect, useState } from 'react'
// import img from '../assets/medical-5459633.svg'
import './Header.css'
import {
     useHistory
} from "react-router-dom";
import { motion } from "framer-motion"
// import Swal from 'sweetalert2'
import { initializeApp } from "firebase/app";
import { FacebookAuthProvider, getAuth } from "firebase/auth";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";

export default function Header() {
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
    const [width, setwidth] = useState(0)
    const [isloading, setisloading] = useState(0)
    useLayoutEffect(() => {
        if (window.innerWidth <= 768) {
            setwidth(0.75)
        }
        else {
            setwidth(1.00)
        }
    }, [width])

    const scrolling = (e, position) => {
        e.preventDefault();
        position = '#' + position;
        const section = document.querySelector(position);
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    const history = useHistory()

    const handleGetStarted=()=>{
        setisloading(1)
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
                history.push("/form/details")
                setisloading(0)
            }).catch((error) => {
                history.push('/')
                document.getElementById("handlelogin").click()
                setisloading(0)
            });
        }
        else{
            document.getElementById("handlelogin").click()
            setisloading(0)
            // Swal.fire({
            //     title:'Access Denied!',
            //     text: 'You need to login with a Google account...',
            //     showCancelButton: true,
            //     confirmButtonText: 'Sign In',
            //     icon: "info",
            //   }).then((result) => {
          
            //     if (result.isConfirmed) {
            //         document.getElementById("handlelogin").click()
            //     }
            // })
        }
        
    }
    return (

        <section className='d-flex align-items-center' id="head" style={{ marginTop: '-35px', minHeight: "100vh" }}>
            <div className='container'>
                {width !== 0 ? <div className="row  mb-5 flex-lg-row-reverse align-items-center ">
                    <motion.div className="col-xl-6 col-lg-5 mb-4 mb-md-0 w_image pe-0 icon"
                        initial={{ opacity: 0 }}
                        animate={{ x: [25, 0], opacity: [0, 1] }}
                        transition={{ ease:[0.645,0.045,0.355,1], duration: .50, delay: width - .35 }}>
                        {/* <img src={img} className="mb-1" alt="" style={{width: "122%", marginLeft: "-125px",filter:" "}} data-builder-edit="image" data-builder-name="image1" aria-controls="#picker-editor" /> */}
                        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                            viewBox="0 0 500 500" style={{ enableBackground: "new 0 0 500 500" }} >
                            {/* <g> */}
                            {/* <defs>
                                    <rect id="SVGID_5_" y="-0.9" transform="matrix(-1 -4.489621e-11 4.489621e-11 -1 500 498.2981)" width="500" height="500" />
                                </defs> */}
                            {/* <clipPath id="SVGID_2_">
                                    <use xlinkHref="#SVGID_5_" style={{overflow:"visible"}} />
                                </clipPath> */}
                            {/* <path className="st0" d="M513.1-11.2c0,0-198.6-49.4-247.6,100.6S15.2,354.9,13.1,509.3l488.6,0.8c6.3,0,11.4-6.7,11.4-15V-11.2z" /> */}
                            {/* </g> */}
                            {/* <g className="st24">
                                <path className="st12" d="M31.4,314.5l-16.6-5.2c-1.1-0.3-1.7-1.5-1.4-2.6l5.2-16.6c0.3-1.1,1.5-1.7,2.6-1.4l16.6,5.2
		c1.1,0.3,1.7,1.5,1.4,2.6L34,313.2C33.6,314.2,32.5,314.9,31.4,314.5z M18,306l12.7,4l4-12.7l-12.7-4L18,306z"/>
                            </g> */}
                            {/* <path className="st26" d="M24,181.5c0,2.2-1.8,4-4,4s-4-1.8-4-4c0-2.2,1.8-4,4-4S24,179.3,24,181.5z" /> */}
                            <path className="st50" d="M440.1,347.8c-0.5-0.5-1.1-1-1.8-1.4L303,271.3c-4.9-2.7-13.4-2.1-19.1,1.4L97.5,386.1
	c-0.6,0.4-1.2,0.8-1.7,1.2l-0.9,0.7c-1.4,1.1-2.2,2.7-2.1,4.4l0,0.8c0.2,1.5,1.3,2.9,3.2,4l135.3,75.1c4.9,2.7,13.4,2.1,19.1-1.4
	l186.4-113.4c3-1.8,4.5-4,4.7-6.1l-0.4-2.1L440.1,347.8z"/>
                            <ellipse className="st51" cx="340.3" cy="252.5" rx="40.8" ry="15.2" />
                            <g>
                                <linearGradient id="SVGID_4_" gradientUnits="userSpaceOnUse" x1="275.3333" y1="201.8414" x2="351.0954" y2="201.8414">
                                    <stop offset="3.684190e-02" style={{ stopColor: "#7DA6FF" }} />
                                    <stop offset="0.2491" style={{ stopColor: "#76A0FB" }} />
                                    <stop offset="0.566" style={{ stopColor: "#618EEF" }} />
                                    <stop offset="0.9465" style={{ stopColor: "#4072DD" }} />
                                    <stop offset="1" style={{ stopColor: "#3B6DDA" }} />
                                </linearGradient>
                                <path style={{ fill: "url(#SVGID_4_)" }} d="M351.1,166.3c0-15.3-17-27.8-37.9-27.8c-20.9,0-37.9,12.4-37.9,27.8V235h0.1
		c-0.1,0.8-0.1,1.6-0.1,2.4c0,15.3,17,27.8,37.9,27.8c20.9,0,37.9-12.4,37.9-27.8c0-1.2-0.1-2.3-0.3-3.4
		C350.8,233.9,351.1,167.5,351.1,166.3z"/>
                                <ellipse className="st53" cx="313.2" cy="245.6" rx="29.4" ry="13.9" />
                                <path className="st54" d="M295.4,238.8l-5.6-1.4c-4.1-1-7.5-5.5-7.5-10v-53c0-4.5,3.4-7.3,7.5-6.3l5.6,1.4c4.1,1,7.5,5.5,7.5,10v53
		C302.9,236.9,299.5,239.8,295.4,238.8z"/>
                                <ellipse className="st55" cx="314" cy="141.8" rx="21" ry="10.7" />
                                <path className="st56" d="M335,141.8c0,5.9-9.4,10.7-21,10.7l-4.2-0.2c12.2-2.6,18.6-8.5,18.1-18.5C332.3,135.8,335,138.6,335,141.8z"
                                />
                                <ellipse className="st57" cx="314" cy="140.2" rx="19" ry="9.7" />
                                <rect x="295.1" y="127.9" className="st57" width="37.9" height="12.3" />
                                <path className="st58" d="M314,149.9c10.5,0,19-4.3,19-9.7v-12.3C328.9,138.4,322.9,146.3,314,149.9z" />
                                <ellipse className="st59" cx="314" cy="127.9" rx="19" ry="9.7" />
                                <ellipse className="st60" cx="314.3" cy="127.2" rx="11.6" ry="5.9" />
                                <path className="st60" d="M297.3,142.7L297.3,142.7c-0.4,0-0.8-0.4-0.8-0.8v-7c0-0.4,0.4-0.8,0.8-0.8l0,0c0.4,0,0.8,0.4,0.8,0.8v7
		C298.1,142.3,297.7,142.7,297.3,142.7z"/>
                                <path className="st60" d="M301.2,145.2L301.2,145.2c-0.4,0-0.8-0.4-0.8-0.8v-7c0-0.4,0.4-0.8,0.8-0.8l0,0c0.4,0,0.8,0.4,0.8,0.8v7
		C302,144.8,301.6,145.2,301.2,145.2z"/>
                                <path className="st60" d="M305.3,146.7L305.3,146.7c-0.4,0-0.8-0.4-0.8-0.8v-7c0-0.4,0.4-0.8,0.8-0.8l0,0c0.4,0,0.8,0.4,0.8,0.8v7
		C306.1,146.3,305.7,146.7,305.3,146.7z"/>
                                <path className="st60" d="M309.9,147.9L309.9,147.9c-0.4,0-0.8-0.4-0.8-0.8v-7c0-0.4,0.4-0.8,0.8-0.8l0,0c0.4,0,0.8,0.4,0.8,0.8v7
		C310.7,147.5,310.3,147.9,309.9,147.9z"/>
                                <path className="st60" d="M331.1,142.7L331.1,142.7c0.4,0,0.8-0.4,0.8-0.8v-7c0-0.4-0.4-0.8-0.8-0.8l0,0c-0.4,0-0.8,0.4-0.8,0.8v7
		C330.3,142.3,330.6,142.7,331.1,142.7z"/>
                                <path className="st60" d="M327.2,145.2L327.2,145.2c0.4,0,0.8-0.4,0.8-0.8v-7c0-0.4-0.4-0.8-0.8-0.8l0,0c-0.4,0-0.8,0.4-0.8,0.8v7
		C326.3,144.8,326.7,145.2,327.2,145.2z"/>
                                <path className="st60" d="M323.1,146.7L323.1,146.7c0.4,0,0.8-0.4,0.8-0.8v-7c0-0.4-0.4-0.8-0.8-0.8l0,0c-0.4,0-0.8,0.4-0.8,0.8v7
		C322.3,146.3,322.7,146.7,323.1,146.7z"/>
                                <path className="st60" d="M318.5,147.9L318.5,147.9c0.4,0,0.8-0.4,0.8-0.8v-7c0-0.4-0.4-0.8-0.8-0.8l0,0c-0.4,0-0.8,0.4-0.8,0.8v7
		C317.7,147.5,318.1,147.9,318.5,147.9z"/>
                                <path className="st60" d="M314.3,148.4L314.3,148.4c-0.4,0-0.8-0.4-0.8-0.8v-7c0-0.4,0.4-0.8,0.8-0.8l0,0c0.4,0,0.8,0.4,0.8,0.8v7
		C315.1,148.1,314.8,148.4,314.3,148.4z"/>
                            </g>
                            <g>
                                <path className="st5" d="M436.8,323.3l-78.9-46.2c-1.1-0.7-0.7-2.1,1.1-3.1l39.7-23.8c1.7-1,4.1-1.3,5.3-0.7l78.9,46.2
		c1.1,0.7,0.7,2.1-1.1,3.1L442,322.6C440.3,323.7,437.9,324,436.8,323.3z"/>
                                <path className="st48" d="M433,268.8l-79.2-45.7c-1.2-0.7-1-1.8,0.3-2.6l30.4-17.6c1.3-0.8,3.4-0.9,4.5-0.2l79.2,45.7
		c1.2,0.7,1,1.8-0.3,2.6l-30.4,17.6C436.2,269.4,434.2,269.5,433,268.8z"/>
                                <path className="st61" d="M467.7,303.8l-32,18.5c-1.3,0.8-2.4-0.2-2.4-2.2l-0.4-47.2c0-2,1-4.2,2.3-5l32-18.5c1.3-0.8,2.4,0.2,2.4,2.2
		l0.4,47.2C470.1,300.8,469.1,303,467.7,303.8z"/>
                                <path className="st62" d="M435,269.3c18.2-3.7,34.7-17.7,34.7-17.7c0-2-1.1-3-2.4-2.2l-32,18.5c-1.3,0.8-2.4,3-2.3,5l0,4.6
		C433.2,275.6,433.8,270,435,269.3z"/>
                                <path className="st62" d="M435.2,322.5c-0.5-0.2-0.8-0.7-0.8-1.2v-51.4c0-0.7,0.8-1.2,1.8-1.2l0,0c1,0,1.8-0.7,1.8,0V321
		C438,321,435.5,322.6,435.2,322.5z"/>
                                <path className="st63" d="M434.1,322.5l-79.2-45.8c-1-0.6-1.9-2.2-1.9-3.6v-50.6c0-1.4,0.8-2,1.9-1.4l79.2,45.8c1,0.6,1.9,2.2,1.9,3.6
		v50.6C435.9,322.5,435.1,323.1,434.1,322.5z"/>
                                <path className="st64" d="M359.5,250.1c0,1,0.6,2,1.5,2.5l45.6,26.8c2,1.2,4.4-0.2,4.4-2.4v-2.3c0-1-0.6-2-1.5-2.5L364,245.4
		c-2-1.2-4.4,0.2-4.4,2.4V250.1z"/>
                                <path className="st48" d="M360.2,261.8l30.2,17.8c0.9,0.5,2-0.1,2-1.1c0-0.5-0.3-0.9-0.7-1.2l-30.2-17.8c-0.9-0.5-2,0.1-2,1.1
		C359.5,261.1,359.8,261.5,360.2,261.8z"/>
                                <path className="st48" d="M386.6,282.2c0-0.2-0.1-0.4-0.3-0.6l-25.7-15.1c-0.4-0.3-1,0-1,0.5c0,0.2,0.1,0.4,0.3,0.6l25.7,15.1
		C386,283,386.6,282.7,386.6,282.2z"/>
                                <path className="st48" d="M369.9,242.6c0.4,0.3,1,0,1-0.5c0-0.2-0.1-0.4-0.3-0.6l-10-5.9c-0.4-0.3-1,0-1,0.5c0,0.2,0.1,0.4,0.3,0.6
		L369.9,242.6z"/>
                            </g>
                            {/* <path className="st25" d="M404.8,450.3c2.9,0,59.4,0,59.4,0" /> */}
                            {/* <path className="st25" d="M425.3,112.6c2.9,0,59.4,0,59.4,0" /> */}
                            {/* <path className="st25" d="M24.8,458.9c2.9,0,24.4,0,24.4,0" /> */}
                            <path className="st26" d="M474.7,413.8c0,2.1-1.7,3.7-3.7,3.7c-2.1,0-3.7-1.7-3.7-3.7c0-2.1,1.7-3.7,3.7-3.7
	C473,410.1,474.7,411.7,474.7,413.8z"/>
                            <path className="st26" d="M386.1,118.3c0,2.1-1.7,3.7-3.7,3.7c-2.1,0-3.7-1.7-3.7-3.7c0-2.1,1.7-3.7,3.7-3.7
	C384.4,114.5,386.1,116.2,386.1,118.3z"/>
                            <path className="st26" d="M99.2,348.4c0,2.1-1.7,3.7-3.7,3.7c-2.1,0-3.7-1.7-3.7-3.7c0-2.1,1.7-3.7,3.7-3.7
	C97.6,344.7,99.2,346.4,99.2,348.4z"/>
                            <path className="st65" d="M463.4,226.4l-25.3-14.7c-2.5-1.4-4.5-4.7-4.5-7.2v-25.9c0-2.5,2-3.4,4.5-2l25.3,14.7c2.5,1.4,4.5,4.7,4.5,7.2
	v25.9C467.9,227,465.8,227.9,463.4,226.4z"/>
                            <path className="st64" d="M455.7,198.1c-2.6-3.9-6.6-6-8.9-4.6s-2.1,5.6,0.5,9.5c2.6,3.9,6.6,6,8.9,4.6S458.3,202,455.7,198.1z
	 M455,205.7c-1.7,1-4.6-0.5-6.5-3.4c-1.9-2.9-2.1-6-0.4-6.9c1.7-1,4.6,0.5,6.5,3.4C456.5,201.6,456.7,204.7,455,205.7z"/>
                            <path className="st64" d="M441.2,206.8L441.2,206.8c-0.4-0.6-0.4-1.3-0.1-1.5l4.2-2.2c0.4-0.2,1,0.1,1.4,0.8l0,0
	c0.4,0.6,0.4,1.3,0.1,1.5l-4.2,2.2C442.3,207.7,441.6,207.4,441.2,206.8z"/>
                            <g>
                                <path className="st65" d="M419.9,201.7l-25.3-14.7c-2.5-1.4-4.5-4.7-4.5-7.2v-25.9c0-2.5,2-3.4,4.5-2l25.3,14.7
		c2.5,1.4,4.5,4.7,4.5,7.2v25.9C424.4,202.3,422.4,203.2,419.9,201.7z"/>
                                <path className="st64" d="M411,177.4l-4.1-9.4l-4,5.4c-0.6,0.5-1,1.2-1.1,2.2l0,0.1l0,0c0,0.1,0,0.3,0,0.5c0,3.1,2.5,7,5.5,8.8
		c3,1.8,5.5,0.7,5.5-2.4C412.8,180.9,412.1,179.1,411,177.4z"/>
                            </g>
                            <g>
                                <path className="st66" d="M425.6,344.5c-0.5-0.5-1.1-1-1.8-1.4L288.6,268c-4.9-2.7-13.4-2.1-19.1,1.4L83.1,382.8
		c-0.6,0.4-1.2,0.8-1.7,1.2l-0.9,0.7c-1.4,1.1-2.2,2.7-2.1,4.4l0,0.8c0.2,1.5,1.3,2.9,3.2,4L216.8,469c4.9,2.7,13.4,2.1,19.1-1.4
		l186.4-113.4c3-1.8,4.5-4,4.7-6.1l-0.4-2.1L425.6,344.5z"/>
                                <polygon className="st67" points="225.2,453.4 95.2,381.2 282,270.4 412.1,342.6 	" />
                                <path className="st66" d="M379.9,315.3l-4.4-2.5l0,0c5.2-3.1,5.2-8,0-10.9l-24.1-13.4c-5.2-2.9-13.7-2.7-19,0.4l-3-1.7
		c-5.5-3-14.3-2.9-19.8,0.4l0,0c-5.5,3.2-5.5,8.3,0,11.3l50.5,28c5.5,3,14.3,2.9,19.8-0.4l0,0C385.4,323.4,385.4,318.3,379.9,315.3z
		"/>
                                <path className="st68" d="M379.9,311l-4.4-2.5l0,0c5.2-3.1,5.2-8,0-10.9l-24.1-13.4c-5.2-2.9-13.7-2.7-19,0.4l-3-1.7
		c-5.5-3-14.3-2.9-19.8,0.4l0,0c-5.5,3.2-5.5,8.3,0,11.3l50.5,28c5.5,3,14.3,2.9,19.8-0.4l0,0C385.4,319.1,385.4,314,379.9,311z"/>
                                <path className="st12" d="M366.1,310.2l-36.9-21.1c-1.3-0.7-1.3-2.6-0.1-3.5l0,0c0.7-0.4,1.5-0.5,2.2-0.1l36.9,21.1
		c1.3,0.7,1.3,2.6,0.1,3.5l0,0C367.6,310.6,366.8,310.6,366.1,310.2z"/>
                                <g>
                                    <g>
                                        <line className="st69" x1="293.7" y1="325" x2="327.6" y2="344" />
                                        <line className="st69" x1="281.2" y1="331.9" x2="338.6" y2="363.5" />
                                        <polygon className="st70" points="262.1,322.7 239.9,310.4 262,297.6 284.2,309.9 			" />
                                        <polyline className="st71" points="257.2,305.7 255.6,312.4 271.3,310.7 			" />
                                    </g>
                                    <g>
                                        <line className="st69" x1="249.4" y1="358.7" x2="283.3" y2="377.6" />
                                        <line className="st69" x1="236.9" y1="365.6" x2="294.3" y2="397.2" />
                                        <line className="st69" x1="199.1" y1="382.8" x2="233.1" y2="401.8" />
                                    </g>
                                    <line className="st69" x1="187.6" y1="393.7" x2="245" y2="425.3" />
                                    <polygon className="st70" points="164.6,380.7 142.4,368.4 164.5,355.6 186.7,367.9 		" />
                                    <polyline className="st71" points="159.7,363.7 158.1,370.3 173.8,368.7 		" />
                                    <polygon className="st70" points="213.2,351.6 191,339.4 213.1,326.5 235.3,338.8 		" />
                                    <polyline className="st71" points="208.3,334.6 206.7,341.3 222.4,339.6 		" />
                                </g>
                            </g>
                            <g>
                                <path className="st5" d="M175.6,308.4c0,2.7-3.9,4.8-8.8,4.8c-4.9,0-8.8-2.2-8.8-4.8s3.9-4.8,8.8-4.8
		C171.7,303.6,175.6,305.8,175.6,308.4z"/>
                                <g>
                                    <path className="st5" d="M192.9,291.7L192.9,291.7l-0.2-0.2l0,0l-1.7-2.2l0,0l-0.2-0.3l0,0c-0.9-0.9-2.3-1.3-4.1-1.1
			c-3.9,0.4-8.2,3.8-9.5,7.6c-0.6,1.7-0.5,3.2,0.2,4.2l0,0l2.1,2.7l0,0c0.9,0.9,2.3,1.4,4.2,1.2c3.9-0.4,8.2-3.8,9.5-7.6
			C193.7,294.3,193.6,292.8,192.9,291.7z"/>
                                    <path className="st5" d="M253.2,266.6l-45.8,25c-0.5-0.3-0.8-0.5-0.8-0.5l-18-3.2l-0.4,8.2c0,0,7.4,5.5,15.7,3.2
			c3.8,0.7,7.1-0.2,9.6-2.6l41.2-23c0.8-0.3,1.5-0.6,2.1-1C260.7,270.2,257.2,264.4,253.2,266.6z"/>

                                    <linearGradient id="SVGID_6_" gradientUnits="userSpaceOnUse" x1="206.698" y1="236.1663" x2="235.9629" y2="286.8546" gradientTransform="matrix(0.9987 5.160000e-02 -5.160000e-02 0.9987 14.3265 -19.4831)">
                                        <stop offset="4.385950e-02" style={{ stopColor: "#E29439" }} />
                                        <stop offset="0.8263" style={{ stopColor: "#E17500" }} />
                                    </linearGradient>
                                    <path style={{ fill: "url(#SVGID_6_)" }} d="M256.8,257c0.7-12.8-7.5-28.8-18.2-35.7c-5.1-3.3-9.9-4-13.6-2.4l0,0h0
			c-0.4,0.2-0.8,0.4-1.1,0.6l-45.6,23.1l29.3,50.7l41.4-23.1l0,0C253.4,268.7,256.4,264.1,256.8,257z"/>

                                    <ellipse transform="matrix(0.8906 -0.4547 0.4547 0.8906 -101.1789 116.6626)" className="st73" cx="192" cy="268.7" rx="17" ry="29.4" />

                                    <ellipse transform="matrix(0.8921 -0.4519 0.4519 0.8921 -102.0653 114.2458)" className="st74" cx="188.1" cy="270.8" rx="14" ry="24.2" />

                                    <ellipse transform="matrix(0.8921 -0.4519 0.4519 0.8921 -84.7349 133.4175)" className="st75" cx="236.9" cy="244.1" rx="14" ry="24.2" />
                                    <path className="st76" d="M191.5,250c-5.2-3.4-10-3.6-13.4-1.3c2.3,0.2,4.9,1.1,7.6,2.8c9.5,6.1,16.6,20.2,16.1,31.5
			c-0.3,5-2,8.7-4.8,10.6c5.9,0.4,10.2-4,10.6-12.1C208.1,270.2,200.9,256.1,191.5,250z"/>
                                    <path className="st77" d="M189.3,290.8c-9.5-6.1-16.6-20.2-16.1-31.5c0.3-5,2-8.7,4.8-10.6c-5.9-0.4-10.2,4-10.6,12.1
			c-0.6,11.3,6.6,25.3,16.1,31.5c5.2,3.4,10,3.6,13.4,1.3C194.6,293.4,192,292.5,189.3,290.8z"/>
                                    <path className="st78" d="M223.8,231l-24.1,12.8c-1.8,1-4.1,0.3-5-1.5l0,0c-1-1.8-0.3-4.1,1.5-5l24.1-12.8c1.8-1,4.1-0.3,5,1.5l0,0
			C226.3,227.8,225.6,230.1,223.8,231z"/>
                                    <path className="st63" d="M197.2,292.5c-3.6,1.7-9,1-12.1-1.5c-3.1-2.5-2.6-5.9,0.9-7.5c3.6-1.7,9-1,12.1,1.5
			C201.2,287.4,200.8,290.8,197.2,292.5z"/>

                                    <rect x="183.2" y="284.8" transform="matrix(0.9922 0.125 -0.125 0.9922 37.2996 -21.7243)" className="st63" width="17.2" height="3.4" />
                                    <path className="st12" d="M197.6,289.7c-3.6,1.7-9,1-12.1-1.5c-3.1-2.5-2.6-5.9,0.9-7.5c3.6-1.7,9-1,12.1,1.5
			C201.6,284.6,201.2,288,197.6,289.7z"/>

                                    <ellipse transform="matrix(0.125 -0.9922 0.9922 0.125 -114.5015 439.7271)" className="st63" cx="192" cy="284.8" rx="3.9" ry="6.3" />
                                    <path className="st63" d="M188.8,295.9c-1.3,3.7-5.6,7.1-9.5,7.6c-3.9,0.4-6.1-2.2-4.7-5.9c1.3-3.7,5.6-7.1,9.5-7.6
			C188,289.5,190.1,292.2,188.8,295.9z"/>

                                    <rect x="172.2" y="293.8" transform="matrix(0.7829 -0.6222 0.6222 0.7829 -144.6404 176.6584)" className="st63" width="17.2" height="3.4" />
                                    <path className="st12" d="M187.1,293.7c-1.3,3.7-5.6,7.1-9.5,7.6c-3.9,0.4-6.1-2.2-4.7-5.9c1.3-3.7,5.6-7.1,9.5-7.6
			C186.3,287.3,188.4,290,187.1,293.7z"/>
                                    <path className="st63" d="M184.9,293.6c-1,2.7-4.1,5.2-7,5.5c-2.9,0.3-4.4-1.6-3.5-4.4c1-2.7,4.1-5.2,7-5.5
			C184.4,289,185.9,290.9,184.9,293.6z"/>
                                    <path className="st63" d="M185.7,281c-3.9-0.9-7.7-4.8-8.6-8.6c-0.9-3.9,1.5-6.3,5.4-5.3c3.9,0.9,7.7,4.8,8.6,8.6
			C191.9,279.5,189.5,281.9,185.7,281z"/>

                                    <rect x="176.5" y="271.3" transform="matrix(0.7037 0.7105 -0.7105 0.7037 248.8102 -50.6347)" className="st63" width="17.2" height="3.4" />
                                    <path className="st12" d="M187.7,279c-3.9-0.9-7.7-4.8-8.6-8.6c-0.9-3.9,1.5-6.3,5.4-5.3c3.9,0.9,7.7,4.8,8.6,8.6
			C193.9,277.6,191.5,280,187.7,279z"/>
                                    <path className="st63" d="M187.5,276.9c-2.8-0.7-5.6-3.5-6.3-6.3c-0.6-2.8,1.1-4.6,3.9-3.9c2.8,0.7,5.6,3.5,6.3,6.3
			C192.1,275.8,190.3,277.6,187.5,276.9z"/>
                                </g>
                                <g>
                                    <g>
                                        <path className="st63" d="M168,311.3c-3.3,2.2-8.8,2.3-12.2,0.3c-3.4-2-3.5-5.4-0.2-7.6c3.3-2.2,8.8-2.3,12.2-0.3
				C171.2,305.8,171.3,309.2,168,311.3z"/>

                                        <rect x="153.2" y="304.5" transform="matrix(0.9998 -2.158097e-02 2.158097e-02 0.9998 -6.5707 3.563)" className="st63" width="17.2" height="3.4" />
                                        <path className="st12" d="M167.9,308.5c-3.3,2.2-8.8,2.3-12.2,0.3c-3.4-2-3.5-5.4-0.2-7.6c3.3-2.2,8.8-2.3,12.2-0.3
				C171.2,303,171.2,306.4,167.9,308.5z"/>
                                        <path className="st63" d="M166.3,307.2c-2.4,1.6-6.4,1.7-8.9,0.2c-2.5-1.5-2.5-4-0.1-5.6c2.4-1.6,6.4-1.7,8.9-0.2
				C168.6,303.1,168.7,305.6,166.3,307.2z"/>
                                    </g>
                                </g>
                            </g>
                            <g>
                                <ellipse className="st50" cx="461.7" cy="377" rx="16" ry="8.6" />
                                <g>
                                    <path className="st79" d="M470.8,368c0-6.2,0.1-25.3,0.1-25.7c0-2.8-1.4-5.4-3.8-7.4c-0.8-0.7-3.3-1.1-3.6-4.3c0,0-14.8-3.7-14.5-0.7
			c0.2,2.5-4.4,3.7-5.7,5c-2.4,2-3.8,4.6-3.8,7.4v28h0.1c0,0.3-0.1,0.6-0.1,1c0,6.3,7,11.3,15.7,11.3c0.4,0,0.7,0,1.1,0
			c8.1-0.4,14.6-5.3,14.6-11.3c0-0.2,0-0.4,0-0.5L470.8,368z"/>
                                    <path className="st80" d="M468.3,350.2c0,3-4,5.6-9.5,6.3l-6.9,0c-5.5-0.8-9.5-3.3-9.5-6.3v16.4h0c0,0.3,0,0.7,0,1
			c0,6.4,5.8,11.6,13,11.6s13-5.2,13-11.6c0-0.5,0-1-0.1-1.4C468.2,366.2,468.3,350.7,468.3,350.2z"/>
                                    <path className="st81" d="M468.3,350.7c0,3.9-5.8,7-13,7c-7.2,0-13-3.1-13-7c0-3.9,5.8-7,13-7C462.5,343.7,468.3,346.9,468.3,350.7z"
                                    />
                                    <path className="st66" d="M465.8,327c-0.2,0.6,0,1.1-0.3,1.7c-0.1,0.2-0.2,0.3-0.4,0.5c0,0,0,0.1,0,0.1c0,0,0-0.1,0-0.1
			c-1.8,2.1-5.7,3.5-10.2,3.5c-6.2,0-11.2-1.7-11.2-5.1l-0.1,4.8v1.9c0,3.4,5,6.1,11.2,6.1c0.8,0,1.6,0,2.4-0.1c5.1-0.6,8.9-3,8.9-6
			v-1.9v0v-4.7C466.2,328,465.9,326.9,465.8,327z"/>
                                    <path className="st82" d="M466.2,327.8c0,3.2-5,5.8-11.2,5.8c-6.2,0-11.2-2.6-11.2-5.8c0-3.2,5-5.8,11.2-5.8
			C461.2,321.9,466.2,324.5,466.2,327.8z"/>
                                    <path className="st83" d="M462,327.8c0,2-3.1,3.6-7,3.6c-3.9,0-7-1.6-7-3.6c0-2,3.1-3.6,7-3.6C458.8,324.1,462,325.8,462,327.8z" />
                                    <path className="st79" d="M445.5,371.6h-0.2c-0.8,0-1.5-0.7-1.5-1.5v-17.1c0-0.8,0.7-1.5,1.5-1.5h0.2c0.8,0,1.5,0.7,1.5,1.5V370
			C447,370.9,446.4,371.6,445.5,371.6z"/>
                                </g>
                            </g>
                            <g>
                                <path className="st50" d="M434.3,403.7c-1.5-4.1-6.1-6-10.3-4.2c-0.1,0-0.1,0-0.1,0.1l0,0l-7.9,3.2c-0.3,0.1-0.6,0.2-0.9,0.3
		c-0.1,0-0.1,0-0.1,0.1l0,0l-2.9,1.2c0,0,0,0,0,0l-84.7,34.6c-0.2,0-0.5,0.1-0.7,0.2l-7.3,8.8l0,0l-6.9,7.3l11.9-1l0,0l9.3-0.5
		c0.3-0.3,0.6-0.6,0.8-1l0.2,0.3l79.2-32.3c-0.3,0.2-0.6,0.4-1,0.6c0,0-0.1,0-0.2,0.1l0,0l3.9-1.5l0,0c0.1,0,0.1,0,0.2-0.1
		c0.3-0.1,0.7-0.3,1-0.5l2.7-1.1l0,0c0.1,0,0.1,0,0.2-0.1c0.6-0.3,1.1-0.6,1.6-1l7-2.9l0,0c0.1,0,0.1,0,0.2-0.1
		C433.6,412.5,435.8,407.8,434.3,403.7z"/>
                                <g>
                                    <path className="st66" d="M423.2,396.8c-0.1,0-0.1,0-0.1,0.1l0,0l-15.2,6.2c-4.2,1.7-6.5,6.4-5,10.5c1.5,4.1,6.1,6,10.3,4.2l15.2-6.2
			l0,0c0.1,0,0.1,0,0.2-0.1c4.2-1.7,6.5-6.4,5-10.5C432.1,397,427.4,395.1,423.2,396.8z"/>
                                    <path className="st66" d="M428.5,411.5l-94.7,38.8l-4.6-7.8l92.2-37.8C435.3,399.2,436.6,407.3,428.5,411.5z" />
                                    <path className="st66" d="M329.3,442.5c-0.7-3.8-3.6-1.3-2.9-6.3l86.5-35.3c6.3-0.8,8.5,0.9,9,3.7L329.3,442.5z" />
                                    <path className="st84" d="M325.8,436.5l-13.1,15.6l20.1-1.2C337.4,447.1,330.2,434.3,325.8,436.5z" />
                                    <path className="st66" d="M311.6,452.5l6.9-7.3c3.4,0.8,5.1,2.9,5.1,6.3L311.6,452.5z" />
                                </g>
                            </g>
                            <g>
                                <path className="st50" d="M139.2,440.3l-54.4-30.1c-6.3-3.5-17.3-2.9-24.5,1.4l0,0c-7.2,4.3-7.9,10.7-1.5,14.2l1.8,1c0,0,0,0,0,0
		l40.1,22.2l12.5,6.9c6.3,3.5,17.3,2.9,24.5-1.4v0C144.9,450.2,145.6,443.8,139.2,440.3z"/>
                                <path className="st12" d="M105.6,454.6l-54.4-30.1c-6.3-3.5-5.7-9.9,1.5-14.2l0,0c7.2-4.3,18.1-5,24.5-1.4l54.4,30.1
		c6.3,3.5,5.7,9.9-1.5,14.2v0C122.9,457.4,111.9,458.1,105.6,454.6z"/>
                                <path className="st85" d="M135.7,443.5c0.2,2.9-2.6,6.5-6.4,8.8l0,0c-7.2,4.3-19.3,4.1-26.6,0l-50.8-28.2c-2.4-1.3-4-3-4.9-4.7
		c0.2,2.6,2.1,5.1,5.6,7.1l50.8,28.2c7.3,4.1,19.1,3.9,26.3-0.5h0C134.4,451.3,137.4,447,135.7,443.5z"/>
                                <polygon className="st64" points="92.9,442.9 71.9,431.3 91.5,419.5 112.5,431.1 	" />
                                <path className="st86" d="M72.1,413.2c-1.2,0.7-3.3,0.8-4.5,0.1c-1.3-0.7-1.3-1.9,0-2.6c1.2-0.7,3.3-0.8,4.5-0.1
		C73.3,411.3,73.3,412.5,72.1,413.2z"/>
                                <path className="st86" d="M60,420.5c-1.2,0.7-3.3,0.8-4.5,0.1c-1.3-0.7-1.3-1.9,0-2.6c1.2-0.7,3.3-0.8,4.5-0.1
		C61.2,418.6,61.2,419.7,60,420.5z"/>
                                <path className="st86" d="M84.3,420c-1.2,0.7-3.3,0.8-4.5,0.1c-1.3-0.7-1.3-1.9,0-2.6s3.3-0.8,4.5-0.1C85.5,418,85.5,419.2,84.3,420z"
                                />
                                <path className="st86" d="M72.3,420.1c-1.2,0.7-3.3,0.8-4.5,0.1c-1.3-0.7-1.3-1.9,0-2.6c1.2-0.7,3.3-0.8,4.5-0.1
		C73.5,418.2,73.5,419.4,72.3,420.1z"/>
                                <path className="st86" d="M72.2,427.2c-1.2,0.7-3.3,0.8-4.5,0.1c-1.3-0.7-1.3-1.9,0-2.6c1.2-0.7,3.3-0.8,4.5-0.1
		C73.4,425.3,73.4,426.5,72.2,427.2z"/>
                                <path className="st86" d="M117.8,438.5c-1.2,0.7-3.3,0.8-4.5,0.1c-1.3-0.7-1.3-1.9,0-2.6c1.2-0.7,3.3-0.8,4.5-0.1
		C119,436.6,119.1,437.8,117.8,438.5z"/>
                                <path className="st86" d="M105.7,445.8c-1.2,0.7-3.3,0.8-4.5,0.1c-1.3-0.7-1.3-1.9,0-2.6c1.2-0.7,3.3-0.8,4.5-0.1
		C106.9,443.9,106.9,445.1,105.7,445.8z"/>
                                <path className="st86" d="M130,445.3c-1.2,0.7-3.3,0.8-4.5,0.1c-1.3-0.7-1.3-1.9,0-2.6c1.2-0.7,3.3-0.8,4.5-0.1
		C131.2,443.4,131.2,444.6,130,445.3z"/>
                                <path className="st86" d="M118,445.5c-1.2,0.7-3.3,0.8-4.5,0.1c-1.3-0.7-1.3-1.9,0-2.6c1.2-0.7,3.3-0.8,4.5-0.1
		C119.2,443.6,119.2,444.7,118,445.5z"/>
                                <path className="st86" d="M117.9,452.6c-1.2,0.7-3.3,0.8-4.5,0.1c-1.3-0.7-1.3-1.9,0-2.6s3.3-0.8,4.5-0.1
		C119.1,450.6,119.1,451.8,117.9,452.6z"/>
                                <path className="st12" d="M94.3,425.5c-1.2,0.7-3.3,0.8-4.5,0.1c-1.3-0.7-1.3-1.9,0-2.6s3.3-0.8,4.5-0.1
		C95.5,423.6,95.6,424.8,94.3,425.5z"/>
                                <path className="st12" d="M82.2,432.8c-1.2,0.7-3.3,0.8-4.5,0.1c-1.3-0.7-1.3-1.9,0-2.6s3.3-0.8,4.5-0.1
		C83.4,430.9,83.5,432,82.2,432.8z"/>
                                <path className="st12" d="M106.5,432.3c-1.2,0.7-3.3,0.8-4.5,0.1c-1.3-0.7-1.3-1.9,0-2.6c1.2-0.7,3.3-0.8,4.5-0.1
		C107.7,430.4,107.7,431.5,106.5,432.3z"/>
                                <path className="st12" d="M94.5,432.5c-1.2,0.7-3.3,0.8-4.5,0.1c-1.3-0.7-1.3-1.9,0-2.6c1.2-0.7,3.3-0.8,4.5-0.1
		C95.7,430.5,95.7,431.7,94.5,432.5z"/>
                                <path className="st12" d="M94.4,439.5c-1.2,0.7-3.3,0.8-4.5,0.1c-1.3-0.7-1.3-1.9,0-2.6c1.2-0.7,3.3-0.8,4.5-0.1
		C95.6,437.6,95.6,438.8,94.4,439.5z"/>
                            </g>
                        </svg>

                    </motion.div>
                    <div className="col-xl-6 col-lg-7 gx-md-1 mb-4 mb-md-0 head" style={{ paddingTop: "25px" }}>
                        <motion.h5 className="fs-3 text mb-4 fw-bold" style={{ fontFamily: "SF Mono", color: "var(--first-color)", lineHeight: 1.7 }}
                            initial={{ opacity: 0 }}
                            animate={{ y: [15, 0], opacity: [0, 1] }}
                            transition={{ease:[0.645,0.045,0.355,1], duration: 0.50, delay: width }}
                        >A ML Based Project</motion.h5>
                        <motion.h2 className="display-1 fw-bold r_size" style={{ color: "var(--heading-color)", fontFamily: 'Domain Dis', lineHeight: 1.08, letterSpacing: '1.58px' }}
                            initial={{ opacity: 0 }}
                            animate={{ y: [15, 0], opacity: [0, 1] }}
                            transition={{ease:[0.645,0.045,0.355,1],  duration: 0.50, delay: width + .35 }}>Your Health Is<br /><span style={{ color: "var(--first-color)" }}>Our Priority</span></motion.h2>
                        {/* <h3 className="display-4 fw-bold r_size" style={{ color: "rgb(34 54 69 / 90%)",fontFamily:'Domain Dis',lineHeight:1,letterSpacing:'1.5px'}}></h3> */}
                        <motion.p className="text t_size" style={{ paddingRight: "100px", color: "var(--text-color)", margin: "30px 0px 0px", lineHeight: 1.25, fontFamily: 'Calibre R', fontSize: "21px" }}
                            initial={{ opacity: 0 }}
                            animate={{ y: [15, 0], opacity: [0, 1] }}
                            transition={{ ease:[0.645,0.045,0.355,1],duration: 0.50, delay: width + .55 }}
                        ><q>No matter where you are or what time it is</q>, a real-time and accurate diagnosis of disesase is always available.</motion.p>
                        <motion.div className="my-5 d-flex"
                            initial={{ opacity: 0 }}
                            animate={{ y: [15, 0], opacity: [0, 1] }}
                            transition={{ease:[0.645,0.045,0.355,1], duration: 0.50, delay: (width + .75) }}
                        >
                            <button type="button" onClick={handleGetStarted} className="bg btn rounded-9  btn_hover b_size" data-mdb-ripple-color="var(--first-color)" style={{ background: "var(--first-color) var(--mdb-gradient)", borderColor: "var(--first-color)", padding: "16px 22px", fontSize: "15px", color: '#FFF', fontFamily: 'SF Mono' }}>
                            {isloading===1?<span className="spinner-border  spinner-border-sm me-2" role="status" aria-hidden="true" ></span>:''}
                                Get Started</button>
                            <button type="button" onClick={(e) => scrolling(e, "info")} className="bg btn btn-outline-primary rounded-9  btn_hover b_size ms-4" data-mdb-ripple-color="var(--first-color)" style={{ background: "var(--black-bg)",border:"1.5px solid", borderColor: "var(--first-color)", padding: "16px 22px", fontSize: "15px", color: 'var(--first-color)', fontFamily: 'SF Mono' }}>Learn More</button>
                        </motion.div>

                    </div>
                </div> : ''}

            </div>
            {/* <img src={img} alt="" style={{width:"70vw",height:"90vh"}}/> */}
        </section>
    )
}
