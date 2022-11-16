import React, { useEffect, useState } from 'react'
import img2 from '../assets/section-title-line.png'
import { motion } from 'framer-motion';
import { initializeApp } from "firebase/app";
import { FacebookAuthProvider, getAuth } from "firebase/auth";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { getCountFromServer, getFirestore, query, where } from "firebase/firestore";
import { useHistory } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import MUIDataTable from "mui-datatables";
import createCache from "@emotion/cache";
import "./Dashboard.css"
import ReactApexChart from 'react-apexcharts';

const muiCache = createCache({
    key: "mui-datatables",
    prepend: true
});
export default function Dashboard() {
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
    let user
    useEffect(() => {

        authenticate()

    })


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
                    user = result.user
                    read_data()
                }).catch((error) => {
                    history.push('/')
                });
            }
            else {
                history.push('/')
            }
        }
    }

    const history = useHistory()
    const [values, setValues] = useState([])
    const [read, setRead] = useState(0)
    const [auth, setauth] = useState(0)
    const [isloading, setisloading] = useState(0)
    const [datevalues, setdatevalues] = useState([])
    const [monthlyvalues, setmonthlyvalues] = useState([])

    const read_data = async () => {
        if (read === 0) {
            setRead(1)
            const month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            const q = query(collection(db, "users"), where("uid", "==", user.uid));
            const snapshot = await getCountFromServer(q);
            let value = []
            let valuecount_date = []
            let valuecount_monthly = []
            let n = 1
            if (snapshot.data().count > 0) {
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    let d = new Date(doc.data().createdAt.toDate())
                    let fulldate = String(d.getDate() + " " + month_names[d.getMonth()] + ", " + d.getFullYear())
                    valuecount_date.push(new Date(fulldate).getTime())
                    if (d.getMonth() === new Date().getMonth() && d.getFullYear() === new Date().getFullYear()) {
                        valuecount_monthly.push(new Date(fulldate).getTime())
                    }
                    value.push([n, doc.data().name, doc.data().dob, doc.data().gender, doc.data().symptoms, doc.data().disease, doc.data().medicine, fulldate])
                    // console.log(`${doc.id} => ${doc.data().createdAt.toDate()}`);
                    n = n + 1
                });
                value.sort(function (a, b) {
                    const date1 = new Date(a[7])
                    const date2 = new Date(b[7])

                    return date2 - date1;
                })
                let index = 1
                value.forEach((val) => {
                    val[0] = index
                    index = index + 1
                })
                setValues(value)
                setdatevalues(countFreq(valuecount_date, valuecount_date.length))
                setmonthlyvalues(countFreq(valuecount_monthly, valuecount_monthly.length))

            }
            setisloading(1)
        }
    }

    const responsive = "standard";
    const tableBodyHeight = "";
    const tableBodyMaxHeight = "";
    const searchBtn = true;
    const downloadBtn = true;
    const printBtn = true;
    const viewColumnBtn = true;
    const filterBtn = true;

    const columns = [
        {
            name: "Sl No.", options: {
                filterOptions: { fullWidth: true },

                setCellProps: () => ({ style: { textAlign: 'center', fontSize: 18, width: "10%", backgroundColor: 'var(--gray-color)', letterSpacing: '1.5px', color: 'var(--heading-color)', fontFamily: 'Calibre R', fontWeight: 550 } }),
                setCellHeaderProps: () => ({ style: { textAlign: 'center', fontSize: 22, height: '65px', letterSpacing: '2px', backgroundColor: 'var(--first-color)', color: '#fff', fontFamily: 'Calibre M' } }),
                sort: false
            }
        },
        {
            name: "Name", options: {
                filterOptions: { fullWidth: true },

                setCellProps: () => ({ style: { textAlign: 'left', fontSize: 18, backgroundColor: 'var(--gray-color)', letterSpacing: '1.5px', color: 'var(--heading-color)', fontFamily: 'Calibre R', fontWeight: 550 } }),
                setCellHeaderProps: () => ({ style: { textAlign: 'left', width: "15%", fontSize: 22, height: '65px', letterSpacing: '2px', backgroundColor: 'var(--first-color)', color: '#fff', fontFamily: 'Calibre M' } }),
                sort: false
            }
        },

        {
            name: "DOB", options: {
                filterOptions: { fullWidth: true },

                setCellProps: () => ({ style: { textAlign: 'center', fontSize: 18, backgroundColor: 'var(--gray-color)', letterSpacing: '2px', color: 'var(--heading-color)', fontFamily: 'Calibre R', fontWeight: 550 } }),
                setCellHeaderProps: () => ({ style: { textAlign: 'center', fontSize: 22, width: "12%", height: '65px', letterSpacing: '2px', backgroundColor: 'var(--first-color)', color: '#fff', fontFamily: 'Calibre M' } }),
                sort: false, display: false
            }
        },
        {
            name: "Gender", options: {
                filterOptions: { fullWidth: true },

                setCellProps: () => ({ style: { textAlign: 'center', fontSize: 18, backgroundColor: 'var(--gray-color)', letterSpacing: '2px', color: 'var(--heading-color)', fontFamily: 'Calibre R', fontWeight: 550 } }),
                setCellHeaderProps: () => ({ style: { textAlign: 'center', fontSize: 22, height: '65px', letterSpacing: '2px', backgroundColor: 'var(--first-color)', color: '#fff', fontFamily: 'Calibre M' } }),
                sort: false, display: false
            }
        },
        {
            name: "Symptoms", options: {
                filterOptions: { fullWidth: true },

                setCellProps: () => ({ style: { textAlign: 'left', fontSize: 18, backgroundColor: 'var(--gray-color)', letterSpacing: '2px', color: 'var(--heading-color)', fontFamily: 'Calibre R', fontWeight: 550 } }),
                setCellHeaderProps: () => ({ style: { textAlign: 'center', fontSize: 22, height: '65px', letterSpacing: '2px', backgroundColor: 'var(--first-color)', color: '#fff', fontFamily: 'Calibre M' } }),
                sort: false
            }
        },
        {
            name: "Disease", options: {
                filterOptions: { fullWidth: true },

                setCellProps: () => ({ style: { textAlign: 'left', fontSize: 18, backgroundColor: 'var(--gray-color)', letterSpacing: '2px', color: 'var(--heading-color)', fontFamily: 'Calibre R', fontWeight: 550 } }),
                setCellHeaderProps: () => ({ style: { textAlign: 'center', fontSize: 22, height: '65px', letterSpacing: '2px', backgroundColor: 'var(--first-color)', color: '#fff', fontFamily: 'Calibre M' } }),
                sort: false
            }
        },
        {
            name: "Medicine", options: {
                filterOptions: { fullWidth: true },

                setCellProps: () => ({ style: { textAlign: 'left', fontSize: 18, backgroundColor: 'var(--gray-color)', letterSpacing: '2px', color: 'var(--heading-color)', fontFamily: 'Calibre R', fontWeight: 550 } }),
                setCellHeaderProps: () => ({ style: { textAlign: 'center', fontSize: 22, height: '65px', letterSpacing: '2px', backgroundColor: 'var(--first-color)', color: '#fff', fontFamily: 'Calibre M' } }),
                sort: false
            }
        },
        {
            name: "Last Checked", options: {
                filterOptions: { fullWidth: true },

                setCellProps: () => ({ style: { textAlign: 'center', width: "20%", fontSize: 18, backgroundColor: 'var(--gray-color)', letterSpacing: '2px', color: 'var(--heading-color)', fontFamily: 'Calibre R', fontWeight: 550 } }),
                setCellHeaderProps: () => ({ style: { textAlign: 'center', fontSize: 22, height: '65px', letterSpacing: '2px', backgroundColor: 'var(--first-color)', color: '#fff', fontFamily: 'Calibre M' } }),
                sort: false
            }
        },

    ];

    const options = {
        // customToolbar: () => {
        //     return (
        //         <img src={img2} alt="Refresh" style={{ width: "20px", height: "20px",marginLeft:'5px',cursor:'pointer',marginBottom:'1px' }} />
        //     //   <Button style={{border:'1px solid #3A3260',marginBottom:'5px',color:'#3A3260',fontWeight:550}} onClick={async()=>await fetchData()}>Refresh</Button>
        //     );
        //   },
        search: searchBtn,
        download: downloadBtn,
        print: printBtn,
        viewColumns: viewColumnBtn,
        filter: filterBtn,
        filterType: "dropdown",
        responsive,
        tableBodyHeight,
        tableBodyMaxHeight,
        selectableRows: "none",
        // onTableChange: (action, state) => {
        //     console.log(action);
        //     console.dir(state);
        // }
    };
    function countFreq(arr, n) {
        var mp = new Map();
        let countvalue = []
        // Traverse through array elements and
        // count frequencies
        for (var i = 0; i < n; i++) {
            if (mp.has(arr[i]))
                mp.set(arr[i], mp.get(arr[i]) + 1)
            else
                mp.set(arr[i], 1)
        }

        var keys = [];
        mp.forEach((value, key) => {
            keys.push(key);
        });
        keys.sort((a, b) => a - b);

        // Traverse through map and print frequencies
        keys.forEach((key) => {

            countvalue.push([key, mp.get(key)]);
        });
        return countvalue
    }

    const chartData = {
        chart: {
            id: "apexchart-example",
            type: "area"
        },
        xaxis: {
            type: "datetime",
            // categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
            labels: {
                style: {
                    colors: 'var(--text-color)',
                    fontSize: '12px',
                    fontFamily: 'Calibre R',
                }
            }
        },

        stroke: {
            curve: 'smooth',
            colors: ["var(--first-color)"],
            width:4
        },
        fill: {
            colors:"var(--first-color)",
            type: "gradient",
            gradient: {
                shade: "light",
                shadeIntensity: 1,
                gradientToColors: ["var(--gray-color)"],
                    opacityFrom: 0.8,
                    opacityTo: 0.5,
                    stops: [0,90,100]
            }
        },
        legend: {
            // position: '',
            // width: 400
            // position: 'top',
        },
  
  dataLabels: {
    enabled: false
  },
        series: [
            {
                name: "No. of Entries",
                type: "area",
                data: datevalues
            },

        ],
        title: {
            text: "Total Visits",
            align: 'left',
            margin: 10,
            offsetX: 10,
            offsetY: -8,
            floating: false,
            style: {
                fontSize: '24px',
                fontWeight: 'regular',
                fontFamily: "Calibre M",
                color: 'var(--text-color)'
            },
        }
    };
    const chartData2 = {
        chart: {
            id: "monthlydata",
            type: "area"
        },
        xaxis: {
            type: "datetime",
            labels: {
                style: {
                    colors: 'var(--text-color)',
                    fontSize: '12px',
                    fontFamily: 'Calibre R',
                }
            }
        },
        stroke: {
            curve: 'smooth',
            colors: ["var(--first-color)"],
            width:4
        },
        fill: {
            colors:"var(--first-color)",
            type: "gradient",
            gradient: {
                shade: "light",
                shadeIntensity: 1,
                gradientToColors: ["var(--gray-color)"],
                    opacityFrom: 0.8,
                    opacityTo: 0.5,
                    stops: [0,90,100]
            }
        },
        
  dataLabels: {
    enabled: false
  },
        legend: {
            // position: '',
            // width: 400
            // position: 'top',
        },
        series: [
            {
                name: "No. of Entries",
                type: "area",
                data: monthlyvalues
            },

        ],
        title: {
            text: "Visited This Month",
            align: 'left',
            margin: 10,
            offsetX: 10,
            offsetY: -8,
            floating: false,
            style: {
                fontSize: '24px',
                fontWeight: 'regular',
                fontFamily: "Calibre M",
                color: 'var(--text-color)'
            },
        }
    };
    return (
        <section className='d-flex align-items-start form' style={{ minHeight: window.innerWidth > 800 ? "78vh" : "76vh", paddingTop: "30px", flexDirection: 'column' }}>

            <motion.div
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: .5 }}
            >
                <h1 className='display-5' style={{ fontFamily: "Calibre M", lineHeight: 1.1, color: "var(--heading-color)", marginBottom: "-4px", letterSpacing: "-0.2px", marginTop: window.innerWidth > 700 ? "-10px" : "10px" }}>Dashboard</h1>
                <div className='pos-rel' style={{ paddingBottom: "24px" }}>
                    <img src={img2} alt="" style={{ filter: "grayScale(1) opacity(0.6) drop-shadow(0 0 0 var(--first-color))" }} />
                </div>
                {isloading === 0 ? <div className="text-center"><div className="spinner-border text-secondary spinner-border " role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                </div>
                    :
                    <div className='container'>
                        <div className="mb-5" style={{ backgroundColor: "var(--gray-color)", padding: "15px", borderRadius: "10px" }}>
                            <h1 className='display-6' style={{ fontFamily: "Calibre M", lineHeight: 1.1, color: "var(--heading-color)", marginBottom: "-8px", letterSpacing: "-0.2px", marginTop: window.innerWidth > 700 ? "5px" : "10px" }}>Overview</h1>
                            <div className='pos-rel' style={{ paddingBottom: "24px" }}>
                                <img src={img2} alt="" style={{ filter: "grayScale(1) opacity(0.6) drop-shadow(0 0 0 var(--first-color))" }} />
                            </div>
                            <div className="row  justify-content-between mb-2 flex-wrap">
                                <div className="col-xl-6 col-lg-5 mb-4 mb-md-0  pe-0 " style={{ width: "48%", borderRadius: "10px" }}>
                                    <ReactApexChart options={chartData} series={chartData.series} type="area"/>
                                </div>
                                <div className="col-xl-6 col-lg-5 mb-4 mb-md-0  pe-0 " style={{ width: "48%", borderRadius: "10px" }}>
                                    <ReactApexChart options={chartData2} series={chartData2.series} type="area"/>
                                </div>
                            </div>
                        </div>
                        <h1 className='display-6 mt-1' style={{ fontFamily: "Calibre M", lineHeight: 1.1, color: "var(--heading-color)", marginBottom: "-8px", letterSpacing: "-0.2px", marginTop: window.innerWidth > 700 ? "5px" : "10px" }}>All Records</h1>
                        <div className='pos-rel' style={{ paddingBottom: "24px" }}>
                            <img src={img2} alt="" style={{ filter: "grayScale(1) opacity(0.6) drop-shadow(0 0 0 var(--first-color))" }} />
                        </div>
                        <CacheProvider value={muiCache} >
                            <ThemeProvider theme={createTheme()}>

                                <MUIDataTable
                                    title={""}
                                    data={values}
                                    columns={columns}
                                    options={options}
                                />
                            </ThemeProvider>
                        </CacheProvider>
                    </div>}

            </motion.div>

        </section>
    )
}
