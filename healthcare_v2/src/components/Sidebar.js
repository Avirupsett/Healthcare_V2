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
import Dashboard from './Dashboard'
import { getCountFromServer, getFirestore, query, where } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import { getAnalytics, logEvent } from "firebase/analytics";
import Adminboard from './Adminboard'
import Footer from './Footer'
import DiabetesForm from './Diabetes Form/DiabetesForm'
import HeartForm from './Heart Form/HeartForm'

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
            if (match.isExact) {
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
        }
        },
        [scroll, setScroll,match],
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
            document.body.style.backgroundColor = "#212121"
            document.documentElement.style.setProperty("--black-bg", "#212121")
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
                    setemail(user.providerData[0].email)
                    setfirstname("Hi, " + user.displayName.split(" ")[0] + " 👋")

                }).catch((error) => {

                });
            }
        }
    }
    const handlelogin = () => {
        Swal.fire({
            html: '<div  style="font-family:Calibre R;margin-bottom:0px;font-size:18px;">Log in to Your Account: <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="mdi-login" width="18" height="18" viewBox="0 0 24 24"><path d="M10,17V14H3V10H10V7L15,12L10,17M10,2H19A2,2 0 0,1 21,4V20A2,2 0 0,1 19,22H10A2,2 0 0,1 8,20V18H10V20H19V4H10V6H8V4A2,2 0 0,1 10,2Z" /></svg></div> ',
            title:`<h2  style="font-family:Domain Dis;font-size:32px;margin-bottom:0px;margin-top:8px;letter-spacing:1.2px;font-weight:600;">Welcome to RapidCare</h2>`,
            // text:"Log in with one of the following:",
            showDenyButton: true,
            showCloseButton: true,
            confirmButtonColor: '#ea4335',
            denyButtonColor: '#1778F2',
            focusConfirm: false,
            focusDeny: false,
            confirmButtonText:
                `<svg style="margin-bottom:2px;" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 640 512" height="1.2em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M386.061 228.496c1.834 9.692 3.143 19.384 3.143 31.956C389.204 370.205 315.599 448 204.8 448c-106.084 0-192-85.915-192-192s85.916-192 192-192c51.864 0 95.083 18.859 128.611 50.292l-52.126 50.03c-14.145-13.621-39.028-29.599-76.485-29.599-65.484 0-118.92 54.221-118.92 121.277 0 67.056 53.436 121.277 118.92 121.277 75.961 0 104.513-54.745 108.965-82.773H204.8v-66.009h181.261zm185.406 6.437V179.2h-56.001v55.733h-55.733v56.001h55.733v55.733h56.001v-55.733H627.2v-56.001h-55.733z"></path></svg> Google`,
            denyButtonText: `<svg style="margin-bottom:2px;margin-right:4px" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 320 512" height="1.2em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path></svg>Facebook`,
            iconHtml: `<svg style="border: 2px solid #ec7293;
            border-radius: 50%;
            padding-top: 10px;padding-bottom:2px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="90px" height="90px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve">  <image id="image0" width="64" height="64" x="0" y="0"
            href="data:image/png;base64,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" />
        </svg>`,
            customClass: {
                icon: 'no-border'
              }
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
        provider.setCustomParameters({
            prompt:"select_account"
        })
        provider.addScope('profile');
        provider.addScope('email');

        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);

                const token = credential.accessToken;
                sessionStorage.setItem("user_token", token)
                sessionStorage.setItem("provider", "google")
                // The signed-in user info.
                const user = result.user;
                logEvent(analytics, 'login', { displayName: user.displayName });

                console.log(user);
                setavatar(user.photoURL)
                setemail(user.providerData[0].email)
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
        
        // provider.addScope('profile');
        // provider.addScope('email');

        signInWithPopup(auth, provider)
            .then((result) => {

                const credential = FacebookAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                sessionStorage.setItem("user_token", token)
                sessionStorage.setItem("provider", "facebook")
                // The signed-in user info.
                const user = result.user;
                logEvent(analytics, 'login', { displayName: user.displayName });
                console.log(user);
                setavatar(user.photoURL)
                setemail(user.providerData[0].email)
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
            setisadmin(0)
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
                            <div className="nav-link dropdown-toggle d-flex align-items-center" data-mdb-toggle="dropdown" aria-expanded="true" style={{ width: "auto", paddingTop: "4px",cursor:"pointer" }}>
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
                        <Footer/>
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
                <Switch>
                    <Route path="/diabetesform">
                        <DiabetesForm />
                    </Route>
                </Switch>
                <Switch>
                    <Route path="/heartform">
                        <HeartForm />
                    </Route>
                </Switch>
            </section>
        </>
    )
}
