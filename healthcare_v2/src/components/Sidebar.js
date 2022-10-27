import React, { useCallback, useEffect, useState } from 'react'
import About from './About'
import Department from './Department'
import Header from './Header'
import './Sidebar.css'
import Team from './Team'
import {
    Switch,
    Route,
    Link,
    useRouteMatch,
    useHistory
} from "react-router-dom";
import Form from './Form'
import { BsSun, BsFillMoonFill, BsFillXDiamondFill, BsFilterLeft, BsHouseDoor, BsInfoCircle, BsGrid, BsFillPeopleFill } from "react-icons/bs";
import { motion } from "framer-motion"
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { signInWithPopup, GoogleAuthProvider, signInWithCredential, signOut, FacebookAuthProvider } from "firebase/auth";
import Swal from 'sweetalert2'
import google_logo from '../assets/8ca486faebd822ddf4baf00321b16df1-google-icon-logo-by-vexels1493381131.png'
import facebook_logo from '../assets/Facebook_Logo_(2019).png'
import Dashboard from './Dashboard'
import { getCountFromServer, getFirestore, query, where } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import { getAnalytics, logEvent } from "firebase/analytics";
import Adminboard from './Adminboard'

export default function Sidebar() {

    const match = useRouteMatch({
        path: "/",
        strict: true,
        sensitive: true
    });
    const history = useHistory()
    const showNavbar = (toggleId, navId, bodyId, headerId) => {
        const toggle = document.getElementById(toggleId),
            nav = document.getElementById(navId),
            bodypd = document.getElementById(bodyId),
            headerpd = document.getElementById(headerId)

        // Validate that all variables exist
        if (toggle && nav && bodypd && headerpd) {
            // toggle.addEventListener('click', () => {
            // show navbar
            nav.classList.toggle('show')
            // change icon
            toggle.classList.toggle('bx-x')
            // add padding to body
            bodypd.classList.toggle('body-pd')
            // add padding to header
            headerpd.classList.toggle('body-pd')
            // })
        }
    }

    const [scroll, setScroll] = useState(window.scrollY)
    const handleActive = useCallback(
        () => {
            setScroll(window.scrollY)
            if (scroll >= 0 && scroll <= window.innerHeight) {
                document.getElementById("home").classList.add('active')
                document.getElementById("about").classList.remove('active')
                document.getElementById("department").classList.remove('active')
                document.getElementById("team").classList.remove('active')
            }
            else if (scroll > window.innerHeight && scroll <= window.innerHeight + window.innerHeight * 1.2) {
                document.getElementById("about").classList.add('active')
                document.getElementById("home").classList.remove('active')
                document.getElementById("department").classList.remove('active')
                document.getElementById("team").classList.remove('active')
            }
            else if (scroll > window.innerHeight * 2.0 && scroll <= window.innerHeight + window.innerHeight * 2.2) {
                document.getElementById("home").classList.remove('active')
                document.getElementById("about").classList.remove('active')
                document.getElementById("department").classList.add('active')
                document.getElementById("team").classList.remove('active')
            }
            else if (scroll > window.innerHeight + window.innerHeight * 2.2) {
                document.getElementById("home").classList.remove('active')
                document.getElementById("about").classList.remove('active')
                document.getElementById("department").classList.remove('active')
                document.getElementById("team").classList.add('active')
            }
        },
        [scroll, setScroll],
    )


    useEffect(() => {
        var r = document.querySelector(':root');
        var rs = getComputedStyle(r);
        document.getElementById("exampleColorInput").value = rs.getPropertyValue("--first-color").trim()
        if (localStorage.getItem("DarkMode") === "on") {
            DarkMode("dark")
        }
        else {
            DarkMode("light")
        }
        window.addEventListener("scroll", () => { handleActive() })

    }, [handleActive])

    const scrolling = (e, position) => {
        e.preventDefault();

        if (match.isExact) {
            position = '#' + position;
            const section = document.querySelector(position);
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        else {
            history.push("/")

        }

    };

    const changeColor = (e) => {
        document.documentElement.style.setProperty("--first-color", e.target.value)
        var r = document.querySelector(':root');
        var rs = getComputedStyle(r);
        document.querySelector('meta[name="theme-color"]').setAttribute('content', rs.getPropertyValue("--first-color").trim());
    }
    const [d_mode, setD_mode] = useState("dark")
    const [avatar, setavatar] = useState("https://0.gravatar.com/avatar/eb0dce8c76311cc93c1730441aaf4bdd?s=32&d=mm&r=g&s=24")
    const [firstname, setfirstname] = useState("")

    function DarkMode(mode) {
        if (mode === "dark") {
            document.body.style.backgroundColor = "#0b0a10"
            document.documentElement.style.setProperty("--black-bg", "#0b0a10")
            document.documentElement.style.setProperty("--heading-color", "#f2f2f2")
            document.documentElement.style.setProperty("--gray-color", "#1b1a1e")
            document.documentElement.style.setProperty("--text-color", "#8892b0")
            localStorage.setItem("DarkMode", "on")
            setD_mode("light")
        }
        else {
            document.body.style = "#f2f2f2"
            document.documentElement.style.setProperty("--black-bg", "#ffffff")
            document.documentElement.style.setProperty("--heading-color", "rgb(34 54 69 / 90%)")
            document.documentElement.style.setProperty("--gray-color", "#f4f9fc")
            document.documentElement.style.setProperty("--text-color", "#647589")
            localStorage.setItem("DarkMode", "off")
            setD_mode("dark")
        }
    }
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
    const analytics = getAnalytics(app);

    useEffect(() => {
        authenticate()

        if (email) {
            read_data()
        }
    })
    const [read, setRead] = useState(0)
    const [email, setemail] = useState("")
    const [isadmin, setisadmin] = useState(0)

    const read_data = async () => {
        if (read === 0) {
            setRead(1)

            const q = query(collection(db, "admin"), where("email", "array-contains", email));
            const snapshot = await getCountFromServer(q);

            if (snapshot.data().count > 0) {
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    setisadmin(1)
                    // console.log(`${doc.id} => ${doc.data()}`);
                    // doc.data().email.forEach((email) => {
                    //     console.log(email)
                    // })
                });

            }
        }
    }
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
                    const user = result.user;
                    setavatar(user.photoURL)
                    setemail(user.email)
                    setfirstname("Hi, " + user.displayName.split(" ")[0] + " 👋")

                }).catch((error) => {

                });
            }
        }
    }
    const handlelogin = () => {
        Swal.fire({
            html: '<h2>Sign in 🔑</h2>',
            showDenyButton: true,
            confirmButtonColor: '#ea4335',
            denyButtonColor: '#1778F2',
            focusConfirm: false,
            focusDeny: false,
            confirmButtonText:
                `<img width=30 style="margin-top:-4px;margin-right:1px" src=${google_logo}> Google`,
            denyButtonText: `<img width=22 style="margin-top:-6px;margin-right:5px" src=${facebook_logo}>Facebook`,
            icon: "question",
        }).then((result) => {

            if (result.isConfirmed) {
                handleloginwithGoogle()
            }
            else if (result.isDenied) {
                handleloginwithFacebook()
            }
        })
    }

    const handleloginwithGoogle = () => {

        // Initialize Firebase

        // Initialize Firebase Authentication and get a reference to the service
        const auth = getAuth(app);
        auth.languageCode = "it";

        const provider = new GoogleAuthProvider();

        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);

                const token = credential.accessToken;
                sessionStorage.setItem("user_token", token)
                sessionStorage.setItem("provider", "google")
                // The signed-in user info.
                const user = result.user;
                logEvent(analytics, 'login',{displayName:user.displayName});

                console.log(user);
                setavatar(user.photoURL)
                setemail(user.email)
                setfirstname("Hi, " + user.displayName.split(" ")[0] + " 👋")
                setRead(0)
                read_data()
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 2500,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })

                Toast.fire({
                    icon: 'success',
                    title: 'Signed in Successfully'
                })
                // ...
            })
            .catch((error) => {
                console.log(error)

            });
    }
    const handleloginwithFacebook = () => {

        // Initialize Firebase

        // Initialize Firebase Authentication and get a reference to the service
        const auth = getAuth(app);
        auth.languageCode = "it";

        const provider = new FacebookAuthProvider();

        signInWithPopup(auth, provider)
            .then((result) => {

                const credential = FacebookAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                sessionStorage.setItem("user_token", token)
                sessionStorage.setItem("provider", "facebook")
                // The signed-in user info.
                const user = result.user;
                logEvent(analytics, 'login',{displayName:user.displayName});
                console.log(user);
                setavatar(user.photoURL)
                setemail(user.email)
                setfirstname("Hi, " + user.displayName.split(" ")[0] + " 👋")
                setRead(0)
                read_data()
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 2500,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })

                Toast.fire({
                    icon: 'success',
                    title: 'Signed in Successfully'
                })
                // ...
            })
            .catch((error) => {
                console.log(error)
            });
    }

    const handlelogout = () => {
        const auth = getAuth(app);
        signOut(auth).then(() => {
            setavatar("https://0.gravatar.com/avatar/eb0dce8c76311cc93c1730441aaf4bdd?s=32&d=mm&r=g&s=24")
            setfirstname("")
            sessionStorage.clear()
            Swal.fire('Logged Out!', '', 'success')
            history.push("/")
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });

    }
    return (
        <>
            <section id="body-pd" >
                <motion.header className="header" id="header"
                    initial={{ opacity: 0 }}
                    animate={{ y: [-50, 0], opacity: [0, 1] }}
                    transition={{ ease: [0.645, 0.045, 0.355, 1], duration: .25, }}>
                    <div className="header_toggle" onClick={() => { showNavbar('header-toggle', 'nav-bar', 'body-pd', 'header') }}> <BsFilterLeft className='' id="header-toggle" style={{ fontSize: "2.5rem" }} /> </div>
                    {/* <div className="form-check form-switch">
                        <label className="form-check-label" for="flexSwitchCheckDefault"></label>
                        <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                    </div> */}
                    <div className='d-flex'>
                        {d_mode === "light" ? <BsSun size={26} style={{ marginRight: "15px", color: "#f2f2f2", cursor: "pointer" }} onClick={() => { DarkMode("light") }} /> : <BsFillMoonFill size={26} style={{ marginRight: "15px", padding: "4px", cursor: "pointer" }} onClick={() => { DarkMode("dark") }} />}

                        <input type="color" className="form-control form-control-color rounded" onInput={changeColor} style={{ padding: "0px 0px", border: "transparent", width: "45px", height: 0 }} id="exampleColorInput" title="Choose your color" autocompleted="" />
                        <li className="nav-item dropdown" style={{ listStyle: "none", width: "auto" }}>
                            <div className="nav-link dropdown-toggle d-flex align-items-center" data-mdb-toggle="dropdown" aria-expanded="true" style={{ width: "auto", paddingTop: "4px" }}>
                                <img src={avatar} referrerPolicy="no-referrer" className="avatar avatar-24 photo rounded-circle" alt='' style={{ width: "24px" }} />
                            </div>
                            <div className="dropdown-menu dropdown-menu-end p-0" aria-labelledby="userDropdown" data-dropdown-in="fadeIn" data-dropdown-out="fadeOut" data-mdb-popper="none" style={{ width: "auto" }}>
                                {firstname ? <div className="dropdown-item" ><strong style={{ fontSize: "20px" }}>{firstname}</strong></div> : ''}
                                {firstname && isadmin === 1 ? <Link className="dropdown-item" to="/adminboard">Admin Board</Link> : ''}
                                {firstname ? <Link className="dropdown-item" to="/dashboard">DashBoard</Link> : ''}

                                {firstname ? <hr className="m-0" /> : ''}
                                {!firstname ? <div className="dropdown-item" id="handlelogin" onClick={handlelogin}>Log In</div> :
                                    <div className="dropdown-item" onClick={handlelogout}>Log Out</div>}

                            </div>
                        </li>
                    </div>

                </motion.header>
                <div className="l-navbar" id="nav-bar">
                    <nav className="nav" style={{ fontFamily: 'SF Mono', fontSize: "1.2rem" }}>
                        <div>
                            <Link to="/" className="nav_logo"> <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ x: [-25, 0], opacity: [0, 1] }}
                                transition={{ ease: [0.645, 0.045, 0.355, 1], duration: .25, delay: .50 }}
                            ><BsFillXDiamondFill className='nav_logo-icon' style={{ fontSize: "1.5rem", marginBottom: "4px" }} /></motion.div> <span className="nav_logo-name">RapidCare</span> </Link>

                            <div className="nav_list">

                                <Link to="/" onClick={(e) => scrolling(e, "head")} className="nav_link active" id="home"> <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ x: [-25, 0], opacity: [0, 1] }}
                                    transition={{ ease: [0.645, 0.045, 0.355, 1], duration: .25, delay: .50 }}
                                ><BsHouseDoor className='nav_icon' style={{ fontSize: "1.5rem" }} /></motion.div> <span className="nav_name">Home</span> </Link>


                                <Link to="/" onClick={(e) => scrolling(e, "info")} className="nav_link" id="about"> <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ x: [-25, 0], opacity: [0, 1] }}
                                    transition={{ ease: [0.645, 0.045, 0.355, 1], duration: .25, delay: .50 }}
                                ><BsInfoCircle className='nav_icon' style={{ fontSize: "1.5rem" }} /></motion.div> <span className="nav_name">About</span> </Link>

                                <Link to="/" onClick={(e) => scrolling(e, "depart")} className="nav_link" id="department"> <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ x: [-25, 0], opacity: [0, 1] }}
                                    transition={{ ease: [0.645, 0.045, 0.355, 1], duration: .25, delay: .50 }}
                                ><BsGrid className='nav_icon' style={{ fontSize: "1.5rem" }} /></motion.div> <span className="nav_name">WorkFlow</span> </Link>

                                <Link to="/" onClick={(e) => scrolling(e, "group")} className="nav_link" id="team"> <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ x: [-25, 0], opacity: [0, 1] }}
                                    transition={{ ease: [0.645, 0.045, 0.355, 1], duration: .25, delay: .50 }}
                                ><BsFillPeopleFill className='nav_icon' style={{ fontSize: "1.5rem" }} /></motion.div> <span className="nav_name">Team</span> </Link>

                            </div>
                        </div>
                        {/* <a href="/" className="nav_link"> <i className='bx bx-message-square-detail nav_icon' style={{ fontSize: "1.5rem" }}></i> <span className="nav_name">Feedback</span> </a> */}
                    </nav>
                </div>
                <Switch>
                    <Route exact path="/">
                        <Header />
                        <About />
                        <Department />
                        <Team />
                    </Route>
                    <Route exact path="/dashboard">
                        <Dashboard />
                    </Route>
                    <Route exact path="/adminboard">
                        <Adminboard />
                    </Route>
                </Switch>
                <Switch>
                    <Route path="/form">
                        <Form />
                    </Route>
                </Switch>
            </section>
        </>
    )
}
