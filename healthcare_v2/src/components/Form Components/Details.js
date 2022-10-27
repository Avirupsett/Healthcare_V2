import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react'
import { BiChevronRight, BiChevronLeft } from 'react-icons/bi';
import { Link, useHistory } from 'react-router-dom';
import img2 from '../../assets/section-title-line.png'
import "./Disease.css"
import Swal from 'sweetalert2'
import { initializeApp } from "firebase/app";
import { FacebookAuthProvider, getAuth } from "firebase/auth";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { getAnalytics, setUserProperties } from "firebase/analytics";

export default function Details() {
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
    const analytics = getAnalytics(app);
    useEffect(() => {
        authenticate()

    })
    const [auth, setauth] = useState(0)
    const [disable, setdisable] = useState(true)
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
                    document.getElementById("form4Example1").value = user.displayName
                    document.getElementById("form4Example2").value = user.email
                    if(!user.email){
                        setdisable(false)
                    }
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
    const HandleStorage = () => {
        let name = null
        let email = null
        let age = null
        let gender = null;


        name = document.getElementById("form4Example1").value
        email = document.getElementById("form4Example2").value
        age = document.getElementById("form4Exampleday").value + "/" + document.getElementById("form4Examplemonth").value + "/" + document.getElementById("form4Exampleyear").value

        if (document.querySelector('input[name="inlineRadioOptions"]:checked'))
            gender = document.querySelector('input[name="inlineRadioOptions"]:checked').value

        if (name && email && age && gender) {
            sessionStorage.setItem("user_name", name)
            sessionStorage.setItem("user_email", email)
            sessionStorage.setItem("user_age", age)
            sessionStorage.setItem("user_gender", gender)
            setUserProperties(analytics, { sex: gender });
            history.push("/form/symptoms")
        }
        else {
            Swal.fire('Incomplete Form !', 'Please fill up all the details...', 'warning')
        }


    }


    return (

        <section className='d-flex align-items-start form gray-bg' style={{ minHeight: window.innerWidth > 800 ? "78vh" : "76vh", paddingTop: "30px", flexDirection: 'column' }}>
            <div className="container" >
                <motion.div
                    initial={{ opacity: 0, x: -25 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: .5 }}
                >
                    <h1 className='display-5' style={{ fontFamily: "Calibre M", lineHeight: 1.1, color: "var(--heading-color)", marginBottom: "-2px", letterSpacing: "-0.2px", marginTop: window.innerWidth > 700 ? "5px" : "10px" }}>Patient Details</h1>
                    <div className='pos-rel' style={{ paddingBottom: "24px" }}>
                        <img src={img2} alt="" style={{ filter: "grayScale(1) opacity(0.6) drop-shadow(0 0 0 var(--first-color))" }} />
                    </div>


                    <div className={`d-flex mb-4  mt-2`} style={{}}>

                        <div className=" form-check" style={{ paddingTop: "5px", paddingLeft: "5px", paddingRight: "0px", fontFamily: "Calibre M", color: "var(--first-color)", fontSize: "20px" }}>
                            Name :
                        </div>
                        <div className={` form-check ${window.innerWidth > 600 ? "w-50" : ""}`} >
                            <input type="text" id="form4Example1" autoComplete='off' name="user_name" required className="form-control" style={{ color: "var(--text-color)", backgroundColor: "var(--gray-bg)", fontFamily: "'Calibre R','Inter','San Francisco','SF Pro Text',-apple-system,system-ui,sans-serif", paddingBottom: "0px", fontSize: "20px" }} />
                        </div>
                    </div>

                    <div className={`d-flex mb-4  mt-2`} style={{}}>

                        <div className=" form-check" style={{ paddingTop: "5px", paddingLeft: "5px", paddingRight: "0px", fontFamily: "Calibre M", color: "var(--first-color)", fontSize: "20px" }}>
                            Email :
                        </div>
                        <div className={` form-check ${window.innerWidth > 600 ? "w-50" : ""}`} >
                            <input className={'form-control'} disabled={disable} type="email" id="form4Example2" autoComplete='off' name="user_email" required  style={{ color: "var(--text-color)", backgroundColor: "var(--gray-bg)", fontFamily: "'Calibre R','Inter','San Francisco','SF Pro Text',-apple-system,system-ui,sans-serif", paddingBottom: "0px", fontSize: "20px" }} />
                        </div>
                    </div>

                    <div className='d-flex '>
                        <div className=" form-check" style={{ paddingTop: "5px", paddingLeft: "5px", paddingRight: "0px", fontFamily: "Calibre M", color: "var(--first-color)", fontSize: "20px" }}>
                            Date of Birth :
                        </div>
                        <div className={` form-check d-flex `} >
                            {/* <input type="date" id="form4Example3" name="user_age" required className="form-control" style={{ color: "var(--text-color)", backgroundColor: "var(--gray-bg)", fontFamily: "'Calibre R','Inter','San Francisco','SF Pro Text',-apple-system,system-ui,sans-serif", paddingBottom: "0px", fontSize: "18px" }} /> */}
                            <span>
                                <select className="form-control" id="form4Exampleday" name="day" style={{ color: "var(--text-color)", backgroundColor: "var(--gray-bg)", fontFamily: "'Calibre R','Inter','San Francisco','SF Pro Text',-apple-system,system-ui,sans-serif", padding: "6px 10px", fontSize: "18px" }}>
                                    <option value="01">1</option>
                                    <option value="02">2</option>
                                    <option value="03">3</option>
                                    <option value="04">4</option>
                                    <option value="05">5</option>
                                    <option value="06">6</option>
                                    <option value="07">7</option>
                                    <option value="08">8</option>
                                    <option value="09">9</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                    <option value="13">13</option>
                                    <option value="14">14</option>
                                    <option value="15">15</option>
                                    <option value="16">16</option>
                                    <option value="17">17</option>
                                    <option value="18">18</option>
                                    <option value="19">19</option>
                                    <option value="20">20</option>
                                    <option value="21">21</option>
                                    <option value="22">22</option>
                                    <option value="23">23</option>
                                    <option value="24">24</option>
                                    <option value="25">25</option>
                                    <option value="26">26</option>
                                    <option value="27">27</option>
                                    <option value="28">28</option>
                                    <option value="29">29</option>
                                    <option value="30">30</option>
                                    <option value="31">31</option>
                                </select>
                            </span>
                            <span >
                                <select name="month" className="form-control" id="form4Examplemonth" style={{ color: "var(--text-color)", backgroundColor: "var(--gray-bg)", fontFamily: "'Calibre R','Inter','San Francisco','SF Pro Text',-apple-system,system-ui,sans-serif", padding: "6px 12px", fontSize: "18px" }}>
                                    <option value="01">January</option>
                                    <option value="02">February</option>
                                    <option value="03">March</option>
                                    <option value="04">April</option>
                                    <option value="05">May</option>
                                    <option value="06">June</option>
                                    <option value="07">July</option>
                                    <option value="08">August</option>
                                    <option value="09">September</option>
                                    <option value="10">October</option>
                                    <option value="11">November</option>
                                    <option value="12">December</option>
                                </select>
                            </span>
                            <span>
                                <select name="year" defaultValue={'1900'} className="form-control" id="form4Exampleyear" style={{ color: "var(--text-color)", backgroundColor: "var(--gray-bg)", fontFamily: "'Calibre R','Inter','San Francisco','SF Pro Text',-apple-system,system-ui,sans-serif", padding: "6px 12px", fontSize: "18px" }}>
                                    <option value="2030">2030</option>
                                    <option value="2029">2029</option>
                                    <option value="2028">2028</option>
                                    <option value="2027">2027</option>
                                    <option value="2026">2026</option>
                                    <option value="2025">2025</option>
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                    <option value="2022">2022</option>
                                    <option value="2021">2021</option>
                                    <option value="2020">2020</option>
                                    <option value="2019">2019</option>
                                    <option value="2018">2018</option>
                                    <option value="2017">2017</option>
                                    <option value="2016">2016</option>
                                    <option value="2015">2015</option>
                                    <option value="2014">2014</option>
                                    <option value="2013">2013</option>
                                    <option value="2012">2012</option>
                                    <option value="2011">2011</option>
                                    <option value="2010">2010</option>
                                    <option value="2009">2009</option>
                                    <option value="2008">2008</option>
                                    <option value="2007">2007</option>
                                    <option value="2006">2006</option>
                                    <option value="2005">2005</option>
                                    <option value="2004">2004</option>
                                    <option value="2003">2003</option>
                                    <option value="2002">2002</option>
                                    <option value="2001">2001</option>
                                    <option value="2000">2000</option>
                                    <option value="1999">1999</option>
                                    <option value="1998">1998</option>
                                    <option value="1997">1997</option>
                                    <option value="1996">1996</option>
                                    <option value="1995">1995</option>
                                    <option value="1994">1994</option>
                                    <option value="1993">1993</option>
                                    <option value="1992">1992</option>
                                    <option value="1991">1991</option>
                                    <option value="1990">1990</option>
                                    <option value="1989">1989</option>
                                    <option value="1988">1988</option>
                                    <option value="1987">1987</option>
                                    <option value="1986">1986</option>
                                    <option value="1985">1985</option>
                                    <option value="1984">1984</option>
                                    <option value="1983">1983</option>
                                    <option value="1982">1982</option>
                                    <option value="1981">1981</option>
                                    <option value="1980">1980</option>
                                    <option value="1979">1979</option>
                                    <option value="1978">1978</option>
                                    <option value="1977">1977</option>
                                    <option value="1976">1976</option>
                                    <option value="1975">1975</option>
                                    <option value="1974">1974</option>
                                    <option value="1973">1973</option>
                                    <option value="1972">1972</option>
                                    <option value="1971">1971</option>
                                    <option value="1970">1970</option>
                                    <option value="1969">1969</option>
                                    <option value="1968">1968</option>
                                    <option value="1967">1967</option>
                                    <option value="1966">1966</option>
                                    <option value="1965">1965</option>
                                    <option value="1964">1964</option>
                                    <option value="1963">1963</option>
                                    <option value="1962">1962</option>
                                    <option value="1961">1961</option>
                                    <option value="1960">1960</option>
                                    <option value="1959">1959</option>
                                    <option value="1958">1958</option>
                                    <option value="1957">1957</option>
                                    <option value="1956">1956</option>
                                    <option value="1955">1955</option>
                                    <option value="1954">1954</option>
                                    <option value="1953">1953</option>
                                    <option value="1952">1952</option>
                                    <option value="1951">1951</option>
                                    <option value="1950">1950</option>
                                    <option value="1949">1949</option>
                                    <option value="1948">1948</option>
                                    <option value="1947">1947</option>
                                    <option value="1946">1946</option>
                                    <option value="1945">1945</option>
                                    <option value="1944">1944</option>
                                    <option value="1943">1943</option>
                                    <option value="1942">1942</option>
                                    <option value="1941">1941</option>
                                    <option value="1940">1940</option>
                                    <option value="1939">1939</option>
                                    <option value="1938">1938</option>
                                    <option value="1937">1937</option>
                                    <option value="1936">1936</option>
                                    <option value="1935">1935</option>
                                    <option value="1934">1934</option>
                                    <option value="1933">1933</option>
                                    <option value="1932">1932</option>
                                    <option value="1931">1931</option>
                                    <option value="1930">1930</option>
                                    <option value="1929">1929</option>
                                    <option value="1928">1928</option>
                                    <option value="1927">1927</option>
                                    <option value="1926">1926</option>
                                    <option value="1925">1925</option>
                                    <option value="1924">1924</option>
                                    <option value="1923">1923</option>
                                    <option value="1922">1922</option>
                                    <option value="1921">1921</option>
                                    <option value="1920">1920</option>
                                    <option value="1919">1919</option>
                                    <option value="1918">1918</option>
                                    <option value="1917">1917</option>
                                    <option value="1916">1916</option>
                                    <option value="1915">1915</option>
                                    <option value="1914">1914</option>
                                    <option value="1913">1913</option>
                                    <option value="1912">1912</option>
                                    <option value="1911">1911</option>
                                    <option value="1910">1910</option>
                                    <option value="1909">1909</option>
                                    <option value="1908">1908</option>
                                    <option value="1907">1907</option>
                                    <option value="1906">1906</option>
                                    <option value="1905">1905</option>
                                    <option value="1904">1904</option>
                                    <option value="1903">1903</option>
                                    <option value="1902">1902</option>
                                    <option value="1901">1901</option>
                                    <option value="1900">1900</option>
                                </select>
                            </span>
                        </div>
                    </div>
                    <div className='d-flex' style={{ color: "var(--text-color)", paddingTop: "25px" }}>
                        <div className="form-check form-check-inline" style={{ paddingLeft: "5px", fontFamily: "Calibre M", color: "var(--first-color)", fontSize: "20px" }}>
                            Gender :
                        </div>
                        <div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="Male" />
                                <label className="" htmlFor="inlineRadio1" style={{ fontFamily: "Calibre R", fontSize: "17px" }}>Male</label>
                            </div>

                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="Female" />
                                <label className="" htmlFor="inlineRadio2" style={{ fontFamily: "Calibre R", fontSize: "17px" }}>Female</label>
                            </div>

                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="Others" />
                                <label className="" htmlFor="inlineRadio3" style={{ fontFamily: "Calibre R", fontSize: "17px" }}>Others</label>
                            </div>
                        </div>
                    </div>

                </motion.div>
                <div className='' style={{ position: "absolute", bottom: 0, paddingBottom: "0.5rem" }}>
                    <Link to="/"><button type="button" className="btn btn-primary rounded-2 ms-auto me-auto me-4 my-4 btn_hover gray-bg" data-mdb-ripple-color="var(--first-color)" style={{ borderColor: "var(--first-color)", padding: "9px 20px", fontSize: "14px", marginTop: "20px", color: 'var(--first-color)', fontFamily: 'SF Mono' }}><BiChevronLeft size={24} style={{ verticalAlign: "-7.5px" }} />  Back</button></Link>
                </div>
                <div className='' style={{ paddingRight: "3rem", position: "absolute", bottom: 0, right: 0, paddingBottom: "0.5rem" }}>
                    <button onClick={HandleStorage} type="button" className="btn btn-primary rounded-2 ms-auto me-auto me-4 my-4 btn_hover" data-mdb-ripple-color="var(--first-color)" style={{ background: "var(--first-color) var(--mdb-gradient)", borderColor: "var(--first-color)", padding: "9px 20px", fontSize: "14px", marginTop: "20px", color: '#FFF', fontFamily: 'SF Mono' }}>Next <BiChevronRight size={24} style={{ verticalAlign: "-7.5px" }} /> </button>
                </div>
            </div>

        </section>

    )
}
