import React, { useEffect, useState } from 'react'
import img2 from '../assets/section-title-line.png'
import { motion } from 'framer-motion';
import { initializeApp } from "firebase/app";
import { FacebookAuthProvider, getAuth } from "firebase/auth";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { getCountFromServer, getFirestore, orderBy, query, where } from "firebase/firestore";
import { useHistory } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import MUIDataTable from "mui-datatables";
import createCache from "@emotion/cache";
import "./Dashboard.css"
import ReactApexChart from 'react-apexcharts';
import { MdOutlineDashboardCustomize } from "react-icons/md";

const muiCache = createCache({
    key: "mui-datatables",
    prepend: true
});
export default function Adminboard() {
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
        if (email) {
            read_data_admin()
        }

    })



    const [email, setemail] = useState("")

    const read_data_admin = async () => {
        if (read === 0) {
            setRead(1)

            const q = query(collection(db, "admin"), where("email", "array-contains", email));
            const snapshot = await getCountFromServer(q);

            if (snapshot.data().count > 0) {
                const querySnapshot = await getDocs(q);

                querySnapshot.forEach((doc) => {
                    read_data()
                    // console.log(`${doc.id} => ${doc.data()}`);
                    // doc.data().email.forEach((email) => {
                    //     console.log(email)
                    // })
                });

            }
            else {
                history.push("/")
            }
        }
    }

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
                    let user = result.user
                    setemail(user.providerData[0].email)
                    if (read === 0 && email) {
                        read_data_admin()
                    }
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
    const [symptomvalues, setsymptomvalues] = useState([])
    const [symptomkeys, setsymptomkeys] = useState([])
    const [symptomvalues_monthly, setsymptomvalues_monthly] = useState([])
    const [symptomkeys_monthly, setsymptomkeys_monthly] = useState([])
    const [diseasevalues, setdiseasevalues] = useState([])
    const [diseasekeys, setdiseasekeys] = useState([])
    const [diseasevalues_monthly, setdiseasevalues_monthly] = useState([])
    const [diseasekeys_monthly, setdiseasekeys_monthly] = useState([])

    const read_data = async () => {

        const month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
        const snapshot = await getCountFromServer(q);
        let value = []
        let valuecount_date = []
        let valuecount_monthly = []
        let valuecount_symptoms = []
        let valuecount_symptoms_monthly = []
        let valuecount_diseases = []
        let valuecount_diseases_monthly = []
        let n = 1
        if (snapshot.data().count > 0) {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                let d = new Date(doc.data().createdAt.toDate())
                let fulldate = String(d.getDate() + " " + month_names[d.getMonth()] + ", " + d.getFullYear())
                valuecount_date.push(new Date(fulldate).getTime())
                if (d.getMonth() === new Date().getMonth() && d.getFullYear() === new Date().getFullYear()) {
                    valuecount_monthly.push(new Date(fulldate).getTime())
                    doc.data().symptoms.forEach((val) => {
                        valuecount_symptoms_monthly.push(val)
                    })
                    valuecount_diseases_monthly.push(doc.data().disease)
                }
                doc.data().symptoms.forEach((val) => {
                    valuecount_symptoms.push(val)

                })
                valuecount_diseases.push(doc.data().disease)
                value.push([n, fulldate, doc.data().name, doc.data().email, doc.data().dob, doc.data().gender, doc.data().city, doc.data().region, doc.data().country, doc.data().symptoms, doc.data().disease, doc.data().medicine])
                // console.log(`${doc.id} => ${doc.data().createdAt.toDate()}`);
                n = n + 1
            });

            setValues(value)
            setdatevalues(countFreq(valuecount_date, valuecount_date.length))
            setmonthlyvalues(countFreq(valuecount_monthly, valuecount_monthly.length))
            const [first, second] = countFreqXY(valuecount_symptoms, valuecount_symptoms.length)
            setsymptomvalues(second)
            setsymptomkeys(first)
            const [first2, second2] = countFreqXY(valuecount_symptoms_monthly, valuecount_symptoms_monthly.length)
            setsymptomvalues_monthly(second2)
            setsymptomkeys_monthly(first2)
            const [third, fourth] = countFreqXY(valuecount_diseases, valuecount_diseases.length)
            setdiseasevalues(fourth)
            setdiseasekeys(third)
            const [third2, fourth2] = countFreqXY(valuecount_diseases_monthly, valuecount_diseases_monthly.length)
            setdiseasevalues_monthly(fourth2)
            setdiseasekeys_monthly(third2)
        }
        setisloading(1)


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
            name: "EntryDate", options: {
                filterOptions: { fullWidth: true },

                setCellProps: () => ({ style: { textAlign: 'center', width: "20%", fontSize: 18, backgroundColor: 'var(--gray-color)', letterSpacing: '2px', color: 'var(--heading-color)', fontFamily: 'Calibre R', fontWeight: 550 } }),
                setCellHeaderProps: () => ({ style: { textAlign: 'center', fontSize: 22, width: "20%", height: '65px', letterSpacing: '2px', backgroundColor: 'var(--first-color)', color: '#fff', fontFamily: 'Calibre M' } }),
                sort: false
            }
        },
        {
            name: "Name", options: {
                filterOptions: { fullWidth: true },
                setCellProps: () => ({ style: { textAlign: 'left', fontSize: 18, backgroundColor: 'var(--gray-color)', letterSpacing: '1.5px', color: 'var(--heading-color)', fontFamily: 'Calibre R', fontWeight: 550 } }),
                setCellHeaderProps: () => ({ style: { textAlign: 'left', fontSize: 22, height: '65px', letterSpacing: '2px', backgroundColor: 'var(--first-color)', color: '#fff', fontFamily: 'Calibre M' } }),
                sort: false
            }
        },
        {
            name: "Email", options: {
                filterOptions: { fullWidth: true },

                setCellProps: () => ({ style: { textAlign: 'left', fontSize: 18, backgroundColor: 'var(--gray-color)', letterSpacing: '1.5px', color: 'var(--heading-color)', fontFamily: 'Calibre R', fontWeight: 550 } }),
                setCellHeaderProps: () => ({ style: { textAlign: 'center', width: "15%", fontSize: 22, height: '65px', letterSpacing: '2px', backgroundColor: 'var(--first-color)', color: '#fff', fontFamily: 'Calibre M' } }),
                sort: false
            }
        },

        {
            name: "DOB", options: {
                filterOptions: { fullWidth: true },

                setCellProps: () => ({ style: { textAlign: 'center', fontSize: 18, backgroundColor: 'var(--gray-color)', letterSpacing: '2px', color: 'var(--heading-color)', fontFamily: 'Calibre R', fontWeight: 550 } }),
                setCellHeaderProps: () => ({ style: { textAlign: 'center', fontSize: 22, width: "12%", height: '65px', letterSpacing: '2px', backgroundColor: 'var(--first-color)', color: '#fff', fontFamily: 'Calibre M' } }),
                sort: false
            }
        },
        {
            name: "Gender", options: {
                filterOptions: { fullWidth: true },

                setCellProps: () => ({ style: { textAlign: 'center', fontSize: 18, backgroundColor: 'var(--gray-color)', letterSpacing: '2px', color: 'var(--heading-color)', fontFamily: 'Calibre R', fontWeight: 550 } }),
                setCellHeaderProps: () => ({ style: { textAlign: 'center', fontSize: 22, height: '65px', letterSpacing: '2px', backgroundColor: 'var(--first-color)', color: '#fff', fontFamily: 'Calibre M' } }),
                sort: false
            }
        },
        {
            name: "City", options: {
                filterOptions: { fullWidth: true },

                setCellProps: () => ({ style: { textAlign: 'center', fontSize: 18, backgroundColor: 'var(--gray-color)', letterSpacing: '2px', color: 'var(--heading-color)', fontFamily: 'Calibre R', fontWeight: 550 } }),
                setCellHeaderProps: () => ({ style: { textAlign: 'center', fontSize: 22, height: '65px', letterSpacing: '2px', backgroundColor: 'var(--first-color)', color: '#fff', fontFamily: 'Calibre M' } }),
                sort: false
            }
        },
        {
            name: "Region", options: {
                filterOptions: { fullWidth: true },

                setCellProps: () => ({ style: { textAlign: 'center', fontSize: 18, backgroundColor: 'var(--gray-color)', letterSpacing: '2px', color: 'var(--heading-color)', fontFamily: 'Calibre R', fontWeight: 550 } }),
                setCellHeaderProps: () => ({ style: { textAlign: 'center', fontSize: 22, height: '65px', letterSpacing: '2px', backgroundColor: 'var(--first-color)', color: '#fff', fontFamily: 'Calibre M' } }),
                sort: false
            }
        },
        {
            name: "Location", options: {
                filterOptions: { fullWidth: true },

                setCellProps: () => ({ style: { textAlign: 'center', fontSize: 18, backgroundColor: 'var(--gray-color)', letterSpacing: '2px', color: 'var(--heading-color)', fontFamily: 'Calibre R', fontWeight: 550 } }),
                setCellHeaderProps: () => ({ style: { textAlign: 'center', fontSize: 22, height: '65px', letterSpacing: '2px', backgroundColor: 'var(--first-color)', color: '#fff', fontFamily: 'Calibre M' } }),
                sort: false
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
    // const values=[
    //     ["1","Gabby George", "12/15/2022","Male","Symptoms","Disease","Medicine","12/15/2015"],
    //     [
    //      "2", "Aiden Lloyd",
    //       "12/15/2022"
    //     ]]
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
    function countFreqXY(arr, n) {
        var mp = new Map();
        let countvalue = []
        let countkey = []
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

            countvalue.push(mp.get(key));
            countkey.push(key);
        });
        return [countkey, countvalue]
    }

    const chartData = {
        chart: {
            id: "apexchart-example",
            type: "area",
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
        dataLabels: {
            enabled: false
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
        series: [
            {
                name: "No. of Entries",
                type: "area",
                data: datevalues
            },

        ],
        title: {
            text: "Total Patients Visited",
            align: 'left',
            margin: 10,
            offsetX: 10,
            offsetY: -5,
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
        dataLabels: {
            enabled: false
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
        series: [
            {
                name: "No. of Entries",
                type: "area",
                data: monthlyvalues
            },

        ],
        title: {
            text: "Patients Visited (monthly)",
            align: 'left',
            margin: 10,
            offsetX: 10,
            offsetY: -5,
            floating: false,
            style: {
                fontSize: '24px',
                fontWeight: 'regular',
                fontFamily: "Calibre M",
                color: 'var(--text-color)'
            },
        }
    };
    const chartData3 = {
        chart: {
            id: "monthlydata",
            type: "bar"
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
            }
        },
        xaxis: {
            // type:"datetime",
            categories: symptomkeys,
            labels: {
                style: {
                    colors: 'var(--text-color)',
                    fontSize: '12px',
                    fontFamily: 'Calibre R',
                }
            }

        },
        dataLabels: {
            enabled: false
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
        series: [
            {
                name: "No. of Entries",
                type: "bar",
                data: symptomvalues
            },

        ],
        title: {
            // text: "Overall Symptoms",
            align: 'left',
            margin: 10,
            offsetX: 10,
            offsetY: -5,
            floating: false,
            style: {
                fontSize: '24px',
                fontWeight: 'bold',
                fontFamily: "Calibre R",
                color: 'var(--heading-color)'
            },
        }
    };
    const chartData3_1 = {
        chart: {
            id: "Symptomsmonthlydata",
            type: "bar"
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: true
            }
        },
        xaxis: {
            // type:"datetime",
            categories: symptomkeys_monthly,

        },
        yaxis:{
            labels: {
                style: {
                    colors: 'var(--text-color)',
                    fontSize: '12px',
                    fontFamily: 'Calibre R',
                }
            }
        },
        stroke: {
            curve: 'smooth'
        },
        dataLabels: {
            enabled: false
          },
        fill:{
            colors:"var(--first-color)",
            type:"solid"
        },
        legend: {
            // position: '',
            // width: 400
            // position: 'top',
        },

        series: [
            {
                name: "No. of Entries",
                type: "bar",
                data: symptomvalues_monthly
            },

        ],
        title: {
            // text: "Overall Symptoms",
            align: 'left',
            margin: 10,
            offsetX: 10,
            offsetY: -5,
            floating: false,
            style: {
                fontSize: '24px',
                fontWeight: 'bold',
                fontFamily: "Calibre R",
                color: 'var(--heading-color)'
            },
        }
    };
    const chartData3_2 = {
        chart: {
            id: "Symptomsmonthlydatadonut",
            type: "donut"
        },
        labels: symptomkeys_monthly,
        chartOptions: {
            labels: symptomkeys_monthly,
        },

        legend: {
            // position: '',
            // width: 400
            // position: 'top',
            fontSize: '14px',
            fontFamily:"Calibre R",
            horizontalAlign: 'left', 
            position: 'bottom',
            labels: {
                colors: "var(--text-color)",
            }
        },
        series: symptomvalues_monthly,
        title: {
            // text: "Overall Symptoms",
            align: 'left',
            margin: 10,
            offsetX: 10,
            offsetY: -5,
            floating: false,
            style: {
                fontSize: '24px',
                fontWeight: 'bold',
                fontFamily: "Calibre R",
                color: 'var(--heading-color)'
            },
        }
    };
    const chartData4 = {
        chart: {
            id: "diseasesdata",
            type: "bar"
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
            }
        },
        xaxis: {
            // type:"datetime",
            categories: diseasekeys,
            labels: {
                style: {
                    colors: 'var(--text-color)',
                    fontSize: '12px',
                    fontFamily: 'Calibre R',
                }
            }

        },
       
        dataLabels: {
            enabled: false
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
                    opacityFrom: 0.9,
                    opacityTo: 0.5,
                    stops: [0,90,100]
            }
        },
        legend: {
            // position: '',
            // width: 400
            // position: 'top',
        },
        series: [
            {
                name: "No. of Entries",
                type: "bar",
                data: diseasevalues
            },

        ],
        title: {
            // text: "Overall Symptoms",
            align: 'left',
            margin: 10,
            offsetX: 10,
            offsetY: -5,
            floating: false,
            style: {
                fontSize: '24px',
                fontWeight: 'bold',
                fontFamily: "Calibre R",
                color: 'var(--heading-color)'
            },
        }
    };
    const chartData4_1 = {
        chart: {
            id: "Diseasesmonthlydata",
            type: "bar"
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: true
            }
        },
        xaxis: {
            // type:"datetime",
            categories: diseasekeys_monthly,
            

        },
        yaxis:{
            labels: {
                style: {
                    colors: 'var(--text-color)',
                    fontSize: '12px',
                    fontFamily: 'Calibre R',
                }
            }
        },
        stroke: {
            curve: 'smooth'
        },
        dataLabels: {
            enabled: false
          },
        fill:{
            colors:"var(--first-color)",
            type:"solid"
        },
        legend: {
            // position: '',
            // width: 400
            // position: 'top',
        },
        series: [
            {
                name: "No. of Entries",
                type: "bar",
                data: diseasevalues_monthly
            },

        ],
        title: {
            // text: "Overall Symptoms",
            align: 'left',
            margin: 10,
            offsetX: 10,
            offsetY: -5,
            floating: false,
            style: {
                fontSize: '24px',
                fontWeight: 'bold',
                fontFamily: "Calibre R",
                color: 'var(--heading-color)'
            },
        }
    };
    const chartData4_2 = {
        chart: {
            id: "diseasesdata",
            type: "donut"
        },
        labels: diseasekeys_monthly,
        chartOptions: {
            labels: diseasekeys_monthly
        },
        // dataLabels: {
        //     formatter(val, opts) {
        //       const name = opts.w.globals.labels[opts.seriesIndex]
        //       return [name, val.toFixed(1) + '%']
        //     }
        //   },
        //   plotOptions: {
        //     pie: {
        //       donut: {
        //         labels: {
        //           show: false,
        //           total: {
        //             showAlways: true,
        //             show: true
        //           }
        //         }
        //       }
        //     }
        //   },
        legend: {
            // position: '',
            // width: 400
            // position: 'top',
            fontSize: '14px',
            fontFamily:"Calibre R",
            labels: {
                colors: "var(--text-color)",
            }
        },
        series: diseasevalues_monthly,


        title: {
            // text: "Overall Symptoms",
            align: 'left',
            margin: 10,
            offsetX: 10,
            offsetY: -5,
            floating: false,
            style: {
                fontSize: '24px',
                fontWeight: 'bold',
                fontFamily: "Calibre R",
                color: 'var(--heading-color)'
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
                <h1 className='display-5 mb-4' style={{ fontFamily: "Calibre M", lineHeight: 1.1, color: "var(--first-color)", marginBottom: "-2px", letterSpacing: "-0.2px", marginTop: window.innerWidth > 700 ? "-10px" : "10px" }}><MdOutlineDashboardCustomize style={{marginBottom:"7px",marginRight:"5px"}}/>  Admin Dashboard</h1>
                {/* <div className='pos-rel' style={{ paddingBottom: "24px" }}>
                    <img src={img2} alt="" style={{ filter: "grayScale(1) opacity(0.6) drop-shadow(0 0 0 var(--first-color))" }} />
                </div> */}
                {isloading === 0 ? <div className="text-center"> <div className="spinner-border text-secondary spinner-border " role="status">
                    <span className="visually-hidden">Loading...</span>
                </div></div> :
                    <div className='container'>
                        <div className="mb-5" style={{ backgroundColor: "var(--gray-color)", padding: "15px", borderRadius: "10px" }}>
                            <h1 className='display-6 ' style={{ fontFamily: "Calibre M", lineHeight: 1.1, color: "var(--heading-color)", marginBottom: "-8px", letterSpacing: "-0.2px", marginTop: window.innerWidth > 700 ? "5px" : "10px" }}>Overview</h1>
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

                        <div className="mb-5" style={{ backgroundColor: "var(--gray-color)", padding: "15px", borderRadius: "10px" }}>
                        <h1 className='display-6' style={{ fontFamily: "Calibre M", lineHeight: 1.1, color: "var(--heading-color)", marginBottom: "-8px", letterSpacing: "-0.2px", marginTop: window.innerWidth > 700 ? "5px" : "10px" }}>Symptoms Statistics</h1>
                            <div className='pos-rel' style={{ paddingBottom: "24px" }}>
                                <img src={img2} alt="" style={{ filter: "grayScale(1) opacity(0.6) drop-shadow(0 0 0 var(--first-color))" }} />
                            </div>
                            <div className="row  justify-content-between mb-2 flex-wrap">
                                <div className="mb-4 mb-md-0  pe-0 " style={{ borderRadius: "10px" }}>
                                    <ReactApexChart options={chartData3} series={chartData3.series} height="470px" />
                                </div>
                            </div>
                        </div>
                        <div className="mb-5" style={{ backgroundColor: "var(--gray-color)", padding: "15px", borderRadius: "10px" }}>
                            <h1 className='display-6' style={{ fontFamily: "Calibre M", lineHeight: 1.1, color: "var(--heading-color)", marginBottom: "-8px", letterSpacing: "-0.2px", marginTop: window.innerWidth > 700 ? "5px" : "10px" }}>Monthly Analysis of Symptoms</h1>
                            <div className='pos-rel' style={{ paddingBottom: "24px" }}>
                                <img src={img2} alt="" style={{ filter: "grayScale(1) opacity(0.6) drop-shadow(0 0 0 var(--first-color))" }} />
                            </div>
                            <div className="row  justify-content-between mb-2 flex-wrap align-items-center">
                                <div className="col-xl-6 col-lg-5 mb-4 mb-md-0  pe-0 " style={{ width: "48%", borderRadius: "10px" }}>
                                    <ReactApexChart options={chartData3_1} series={chartData3_1.series} type="bar" height={`${20*symptomkeys_monthly.length}px`}/>
                                </div>
                                <div className="col-xl-6 col-lg-5 mb-4 mb-md-0  pe-0 " style={{ width: "49%", borderRadius: "10px" }}>
                                    <ReactApexChart options={chartData3_2} series={chartData3_2.series} type="donut" height={`${20*symptomkeys_monthly.length}px`}/>
                                </div>
                            </div>
                        </div>
                        <div className="mb-5" style={{ backgroundColor: "var(--gray-color)", padding: "15px", borderRadius: "10px" }}>
                            <h1 className='display-6' style={{ fontFamily: "Calibre M", lineHeight: 1.1, color: "var(--heading-color)", marginBottom: "2px", letterSpacing: "-0.2px", marginTop: window.innerWidth > 700 ? "5px" : "10px" }}>Diseases Statistics</h1>
                            <div className='pos-rel' style={{ paddingBottom: "24px" }}>
                                <img src={img2} alt="" style={{ filter: "grayScale(1) opacity(0.6) drop-shadow(0 0 0 var(--first-color))" }} />
                            </div>
                            <div className="row  justify-content-between mb-2 flex-wrap">
                                <div className="mb-4 mb-md-0  pe-0 " style={{ borderRadius: "10px" }}>
                                    <ReactApexChart options={chartData4} series={chartData4.series} height="470px" />
                                </div>
                            </div>
                        </div>
                        <div className="mb-5" style={{ backgroundColor: "var(--gray-color)", padding: "15px", borderRadius: "10px" }}>
                            <h1 className='display-6' style={{ fontFamily: "Calibre M", lineHeight: 1.1, color: "var(--heading-color)", marginBottom: "-8px", letterSpacing: "-0.2px", marginTop: window.innerWidth > 700 ? "5px" : "10px" }}>Monthly Analysis of Diseases</h1>
                            <div className='pos-rel' style={{ paddingBottom: "24px" }}>
                                <img src={img2} alt="" style={{ filter: "grayScale(1) opacity(0.6) drop-shadow(0 0 0 var(--first-color))" }} />
                            </div>
                            <div className="row  justify-content-between mb-2 flex-wrap align-items-center">
                                <div className="col-xl-6 col-lg-5 mb-4 mb-md-0  pe-0 " style={{ width: "48%", borderRadius: "10px" }}>
                                    <ReactApexChart options={chartData4_1} series={chartData4_1.series} type="bar" height={`${25*diseasekeys_monthly.length}px`}/>
                                </div>
                                <div className="col-xl-6 col-lg-5 mb-4 mb-md-0  pe-0 " style={{ width: "49%", borderRadius: "10px" }}>
                                    <ReactApexChart options={chartData4_2} series={chartData4_2.series} type="donut" />
                                </div>
                            </div>
                        </div>
                        <h1 className='display-6 mt-1' style={{ fontFamily: "Calibre M", lineHeight: 1.1, color: "var(--heading-color)", marginBottom: "2px", letterSpacing: "-0.2px", marginTop: window.innerWidth > 700 ? "5px" : "10px" }}>All Patients Details</h1>
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
