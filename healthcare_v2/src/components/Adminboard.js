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
    const [allsymptoms, setallsymptoms] = useState([])
    const [alldisease, setalldisease] = useState([])
    

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
        let valuecount_allsymptoms = []
        let valuecount_alldisease = []
        let n = 1
        if (snapshot.data().count > 0) {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                let d = new Date(doc.data().createdAt.toDate())
                let fulldate = String(d.getDate() + " " + month_names[d.getMonth()] + ", " + d.getFullYear())
                valuecount_date.push(new Date(fulldate).getTime()+ 86400000)
                if (d.getMonth() === new Date().getMonth() && d.getFullYear() === new Date().getFullYear()) {
                    valuecount_monthly.push(new Date(fulldate).getTime()+ 86400000)
                    doc.data().symptoms.forEach((val) => {
                        valuecount_symptoms_monthly.push(val)

                    })
                    valuecount_diseases_monthly.push(doc.data().disease)
                }
                doc.data().symptoms.forEach((val) => {
                    valuecount_symptoms.push(val)
                    valuecount_allsymptoms.push([val, d.getMonth(), d.getFullYear()])
                })
                valuecount_diseases.push(doc.data().disease)
                valuecount_alldisease.push([doc.data().disease, d.getMonth(), d.getFullYear()])
                value.push([n, fulldate, doc.data().name, doc.data().email, doc.data().dob, doc.data().gender, doc.data().city, doc.data().region, doc.data().country, doc.data().symptoms, doc.data().disease, doc.data().medicine])
                // console.log(`${doc.id} => ${doc.data().createdAt.toDate()}`);
                n = n + 1
            });

            setallsymptoms(valuecount_allsymptoms)
            setalldisease(valuecount_alldisease)
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
            },
            axisBorder: {
                show: false
            }
        },
        stroke: {
            curve: 'smooth',
            colors: ["var(--first-color)"],
            width: 4
        },
        dataLabels: {
            enabled: false
        },
        fill: {
            colors: "var(--first-color)",
            type: "gradient",
            gradient: {
                shade: "light",
                shadeIntensity: 1,
                gradientToColors: ["var(--gray-color)"],
                opacityFrom: 0.8,
                opacityTo: 0.5,
                stops: [0, 90, 100]
            }
        },
        grid: {
            strokeDashArray: 4
        },
        yaxis: {
            floating: false,
            labels: {
                style: {
                    colors: 'var(--text-color)',
                    fontSize: '14px',
                    fontFamily: 'Calibre R',
                }
            },
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
            },
            axisBorder: {
                show: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            colors: ["var(--first-color)"],
            width: 4
        },
        fill: {
            colors: "var(--first-color)",
            type: "gradient",
            gradient: {
                shade: "light",
                shadeIntensity: 1,
                gradientToColors: ["var(--gray-color)"],
                opacityFrom: 0.8,
                opacityTo: 0.5,
                stops: [0, 90, 100]
            }
        },
        legend: {
            // position: '',
            // width: 400
            // position: 'top',
        },
        grid: {
            strokeDashArray: 4
        },
        yaxis: {
            floating: false,
            labels: {
                style: {
                    colors: 'var(--text-color)',
                    fontSize: '14px',
                    fontFamily: 'Calibre R',
                }
            },
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
            type: "bar",
            toolbar: {
                tools: {
                    download: true,
                    selection: false,
                    zoom: false,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                    reset: false

                }
            },
            zoom: {
                enabled: false
            }
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
            },
            axisBorder: {
                show: false
            },
        },
        grid: {
            strokeDashArray: 4
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            colors: ["var(--first-color)"],
            width: 4
        },
        yaxis: {
            labels: {
                style: {
                    colors: 'var(--text-color)',
                    fontSize: '14px',
                    fontFamily: 'Calibre R',
                }
            }
        },
        fill: {
            colors: "var(--first-color)",
            type: "gradient",
            gradient: {
                shade: "light",
                shadeIntensity: 1,
                gradientToColors: ["var(--gray-color)"],
                opacityFrom: 0.8,
                opacityTo: 0.5,
                stops: [0, 90, 100]
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
            labels: {
                style: {
                    colors: 'var(--text-color)',
                    fontSize: '14px',
                    fontFamily: 'Calibre R',
                }
            },
            axisBorder: {
                show: false
            }
        },
        yaxis: {
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
            width: 2,
            colors: ['transparent']
        },
        dataLabels: {
            enabled: false
        },
        fill: {
            colors: "var(--first-color)",
            type: "solid"
        },
        legend: {
            // position: '',
            // width: 400
            // position: 'top',
        },
        grid: {
            strokeDashArray: 4
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
            fontFamily: "Calibre R",
            horizontalAlign: 'left',
            position: `${window.innerWidth<450 ||symptomkeys_monthly.length > 25 ? 'bottom' : 'right'}`,
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
            type: "bar",
            toolbar: {
                tools: {
                    download: true,
                    selection: false,
                    zoom: false,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                    reset: false

                },
            },
            zoom: {
                enabled: false
            }
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
            },
            axisBorder: {
                show: false
            },

        },

        yaxis: {
            labels: {
                style: {
                    colors: 'var(--text-color)',
                    fontSize: '14px',
                    fontFamily: 'Calibre R',
                }
            }
        },
        grid: {
            strokeDashArray: 4
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            colors: ["var(--first-color)"],
            width: 4
        },
        fill: {
            colors: "var(--first-color)",
            type: "gradient",
            gradient: {
                shade: "light",
                shadeIntensity: 1,
                gradientToColors: ["var(--gray-color)"],
                opacityFrom: 0.9,
                opacityTo: 0.5,
                stops: [0, 90, 100]
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
            labels: {
                style: {
                    colors: 'var(--text-color)',
                    fontSize: '14px',
                    fontFamily: 'Calibre R',
                }
            },
            axisBorder: {
                show: false
            },

        },
        yaxis: {
            labels: {
                style: {
                    colors: 'var(--text-color)',
                    fontSize: '12px',
                    fontFamily: 'Calibre R',
                }
            }
        },
        grid: {
            strokeDashArray: 4
        },
        stroke: {
            curve: 'smooth',
            width: 2,
            colors: ['transparent']
        },
        dataLabels: {
            enabled: false
        },
        fill: {
            colors: "var(--first-color)",
            type: "solid"
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
            position: `${window.innerWidth<450 ? 'bottom' : 'right'}`,
            fontSize: '14px',
            fontFamily: "Calibre R",
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
    function handle_symptoms() {
        let month = parseInt(document.getElementById("msymptoms").value)
        let year = parseInt(document.getElementById("ysymptoms").value)

        let valuecount_allsymptoms = []
        allsymptoms.forEach((val) => {
            if (val[1] === (month) && val[2] === year) {
                valuecount_allsymptoms.push(val[0])
            }
        })
        const [first2, second2] = countFreqXY(valuecount_allsymptoms, valuecount_allsymptoms.length)
        setsymptomvalues_monthly(second2)
        setsymptomkeys_monthly(first2)
        
    }
    function handle_disease() {
        let month = parseInt(document.getElementById("mdisease").value)
        let year = parseInt(document.getElementById("ydisease").value)

        let valuecount_alldisease = []
        alldisease.forEach((val) => {
            if (val[1] === (month) && val[2] === year) {
                valuecount_alldisease.push(val[0])
            }
        })
        const [first2, second2] = countFreqXY(valuecount_alldisease, valuecount_alldisease.length)
        setdiseasevalues_monthly(second2)
        setdiseasekeys_monthly(first2)
    }
    return (
        <section className='d-flex align-items-start form ps-lg-4' style={{ minHeight: window.innerWidth > 800 ? "78vh" : "76vh", paddingTop: "30px", flexDirection: 'column' }}>

            <motion.div
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: .5 }}
            >
                <h1 className='display-5 mb-4' style={{ fontFamily: "Calibre M", lineHeight: 1.1, color: "var(--first-color)", marginBottom: "-2px", letterSpacing: "-0.2px", marginTop: window.innerWidth > 700 ? "-10px" : "10px" }}><MdOutlineDashboardCustomize style={{ marginBottom: "7px", marginRight: "5px" }} />  Admin Dashboard</h1>
                {/* <div className='pos-rel' style={{ paddingBottom: "24px" }}>
                    <img src={img2} alt="" style={{ filter: "grayScale(1) opacity(0.6) drop-shadow(0 0 0 var(--first-color))" }} />
                </div> */}
                {isloading === 0 ? <div className="text-center"> <div className="spinner-border text-secondary spinner-border " role="status">
                    <span className="visually-hidden">Loading...</span>
                </div></div> :
                    <div className='container '>
                        <div className="mb-5" style={{ backgroundColor: "var(--gray-color)", padding: "15px", borderRadius: "10px" }}>
                            <h1 className='display-6 ' style={{ fontFamily: "Calibre M", lineHeight: 1.1, color: "var(--heading-color)", marginBottom: "-8px", letterSpacing: "-0.2px", marginTop: window.innerWidth > 700 ? "5px" : "10px" }}>Overview</h1>
                            <div className='pos-rel' style={{ paddingBottom: "24px" }}>
                                <img src={img2} alt="" style={{ filter: "grayScale(1) opacity(0.6) drop-shadow(0 0 0 var(--first-color))" }} />
                            </div>
                            <div className="row  justify-content-between mb-2 flex-wrap">
                                <div className="col-xl-6 col-lg-6 mb-4  pe-0 " style={{  borderRadius: "10px" }}>
                                    <ReactApexChart options={chartData} series={chartData.series} type="area" />
                                </div>
                                <div className="col-xl-6 col-lg-6 mb-4  pe-0 " style={{ borderRadius: "10px" }}>
                                    <ReactApexChart options={chartData2} series={chartData2.series} type="area" />
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
                            <div className='pos-rel' style={{ paddingBottom: "15px" }}>
                                <img src={img2} alt="" style={{ filter: "grayScale(1) opacity(0.6) drop-shadow(0 0 0 var(--first-color))" }} />
                            </div>
                            <div className="row  justify-content-between mb-2 flex-wrap align-items-center">
                                <div className='d-flex flex-align-center justify-content-center mb-3'>
                                    <span >
                                        <select name="month" defaultValue={new Date().getMonth()} onChange={() => handle_symptoms()} className="form-control" id="msymptoms" style={{ color: "var(--text-color)", backgroundColor: "var(--gray-bg)", fontFamily: "'Calibre R','Inter','San Francisco','SF Pro Text',-apple-system,system-ui,sans-serif", padding: "6px 12px", fontSize: "22px", borderColor: "transparent", borderBottom: "1px solid var(--text-color)", cursor: "pointer" }}>
                                            <option value="0">January</option>
                                            <option value="1">February</option>
                                            <option value="2">March</option>
                                            <option value="3">April</option>
                                            <option value="4">May</option>
                                            <option value="5">June</option>
                                            <option value="6">July</option>
                                            <option value="7">August</option>
                                            <option value="8">September</option>
                                            <option value="9">October</option>
                                            <option value="10">November</option>
                                            <option value="11">December</option>
                                        </select>
                                    </span>
                                    <span>
                                        <select name="year" defaultValue={new Date().getFullYear()} onChange={() => handle_symptoms()} className="form-control" id="ysymptoms" style={{ color: "var(--text-color)", backgroundColor: "var(--gray-bg)", fontFamily: "'Calibre R','Inter','San Francisco','SF Pro Text',-apple-system,system-ui,sans-serif", padding: "6px 12px", fontSize: "22px", borderColor: "transparent", borderBottom: "1px solid var(--text-color)", cursor: "pointer" }}>
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
                               <div className="col-xl-6 col-lg-6 mb-4  pe-0 " style={{ borderRadius: "10px" }}>
                                    <ReactApexChart options={chartData3_1} series={chartData3_1.series} type="bar" height={symptomkeys_monthly.length > 10 ? `${20 * symptomkeys_monthly.length}px` : `300px`} />
                                </div>
                                    <div className="col-xl-6 col-lg-6 mb-4 pe-0 " style={{ borderRadius: "10px" }}>
                                        <ReactApexChart options={chartData3_2} series={chartData3_2.series} type="donut" height={symptomkeys_monthly.length > 10 ? `${20 * symptomkeys_monthly.length}px` : `400px`} />
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
                                <div className='d-flex flex-align-center justify-content-center mb-3'>
                                    <span >
                                        <select name="month" defaultValue={new Date().getMonth()} onChange={() => handle_disease()} className="form-control" id="mdisease" style={{ color: "var(--text-color)", backgroundColor: "var(--gray-bg)", fontFamily: "'Calibre R','Inter','San Francisco','SF Pro Text',-apple-system,system-ui,sans-serif", padding: "6px 12px", fontSize: "22px", borderColor: "transparent", borderBottom: "1px solid var(--text-color)", cursor: "pointer" }}>
                                            <option value="0">January</option>
                                            <option value="1">February</option>
                                            <option value="2">March</option>
                                            <option value="3">April</option>
                                            <option value="4">May</option>
                                            <option value="5">June</option>
                                            <option value="6">July</option>
                                            <option value="7">August</option>
                                            <option value="8">September</option>
                                            <option value="9">October</option>
                                            <option value="10">November</option>
                                            <option value="11">December</option>
                                        </select>
                                    </span>
                                    <span>
                                        <select name="year" defaultValue={new Date().getFullYear()} onChange={() => handle_disease()} className="form-control" id="ydisease" style={{ color: "var(--text-color)", backgroundColor: "var(--gray-bg)", fontFamily: "'Calibre R','Inter','San Francisco','SF Pro Text',-apple-system,system-ui,sans-serif", padding: "6px 12px", fontSize: "22px", borderColor: "transparent", borderBottom: "1px solid var(--text-color)", cursor: "pointer" }}>
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
                                <div className="col-xl-6 col-lg-6 mb-4 pe-0 " style={{  borderRadius: "10px" }}>
                                    <ReactApexChart options={chartData4_1} series={chartData4_1.series} type="bar" height={diseasekeys_monthly.length > 10 ? `${25 * diseasekeys_monthly.length}px` : `250px`} />
                                </div>
                                <div className="col-xl-6 col-lg-6 mb-4  pe-0 " style={{  borderRadius: "10px" }}>
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
