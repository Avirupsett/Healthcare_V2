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
        if(auth===0){
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

    const read_data = async () => {
        if(read===0){
            setRead(1)
            const month_names=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const snapshot = await getCountFromServer(q);
        let value=[]
        let n=1
        if(snapshot.data().count>0){
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            let d =new Date(doc.data().createdAt.toDate())
            let fulldate=String(d.getDate()+" "+month_names[d.getMonth()]+", "+d.getFullYear())
            value.push([n,doc.data().name,doc.data().dob,doc.data().gender,doc.data().symptoms,doc.data().disease,doc.data().medicine,fulldate])
            // console.log(`${doc.id} => ${doc.data().createdAt.toDate()}`);
            n=n+1
        });
        setValues(value)
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
        { name: "Sl No.", options: { filterOptions: { fullWidth: true },
     
        setCellProps: () => ({ style: { textAlign:'center',fontSize:18,width:"10%",backgroundColor:'var(--gray-color)',letterSpacing:'1.5px',color:'var(--heading-color)',fontFamily:'Calibre R',fontWeight:550 }}),
        setCellHeaderProps: () => ({ style: { textAlign:'center',fontSize:22,height:'65px',letterSpacing:'2px',backgroundColor:'var(--first-color)',color:'#fff',fontFamily:'Calibre M'}}),
        sort:false   } },
        { name: "Name", options: { filterOptions: { fullWidth: true },
     
        setCellProps: () => ({ style: { textAlign:'left',fontSize:18,backgroundColor:'var(--gray-color)',letterSpacing:'1.5px',color:'var(--heading-color)',fontFamily:'Calibre R',fontWeight:550 }}),
        setCellHeaderProps: () => ({ style: { textAlign:'left',width:"15%",fontSize:22,height:'65px',letterSpacing:'2px',backgroundColor:'var(--first-color)',color:'#fff',fontFamily:'Calibre M'}}),
        sort:false   } },
      
        { name:"DOB", options: { filterOptions: { fullWidth: true },
     
        setCellProps: () => ({ style: { textAlign:'center',fontSize:18,backgroundColor:'var(--gray-color)',letterSpacing:'2px',color:'var(--heading-color)',fontFamily:'Calibre R',fontWeight:550 }}),
        setCellHeaderProps: () => ({ style: { textAlign:'center',fontSize:22,width:"12%",height:'65px',letterSpacing:'2px',backgroundColor:'var(--first-color)',color:'#fff',fontFamily:'Calibre M'}}),
        sort:false,display: false  } },
        { name:"Gender", options: { filterOptions: { fullWidth: true },
     
        setCellProps: () => ({ style: { textAlign:'center',fontSize:18,backgroundColor:'var(--gray-color)',letterSpacing:'2px',color:'var(--heading-color)',fontFamily:'Calibre R',fontWeight:550 }}),
        setCellHeaderProps: () => ({ style: { textAlign:'center',fontSize:22,height:'65px',letterSpacing:'2px',backgroundColor:'var(--first-color)',color:'#fff',fontFamily:'Calibre M'}}),
        sort:false ,display: false   } },
        { name:"Symptoms", options: { filterOptions: { fullWidth: true },
     
        setCellProps: () => ({ style: { textAlign:'left',fontSize:18,backgroundColor:'var(--gray-color)',letterSpacing:'2px',color:'var(--heading-color)',fontFamily:'Calibre R',fontWeight:550 }}),
        setCellHeaderProps: () => ({ style: { textAlign:'center',fontSize:22,height:'65px',letterSpacing:'2px',backgroundColor:'var(--first-color)',color:'#fff',fontFamily:'Calibre M'}}),
        sort:false   } },
        { name:"Disease", options: { filterOptions: { fullWidth: true },
     
        setCellProps: () => ({ style: { textAlign:'left',fontSize:18,backgroundColor:'var(--gray-color)',letterSpacing:'2px',color:'var(--heading-color)',fontFamily:'Calibre R',fontWeight:550 }}),
        setCellHeaderProps: () => ({ style: { textAlign:'center',fontSize:22,height:'65px',letterSpacing:'2px',backgroundColor:'var(--first-color)',color:'#fff',fontFamily:'Calibre M'}}),
        sort:false   } },
        { name:"Medicine", options: { filterOptions: { fullWidth: true },
     
        setCellProps: () => ({ style: { textAlign:'left',fontSize:18,backgroundColor:'var(--gray-color)',letterSpacing:'2px',color:'var(--heading-color)',fontFamily:'Calibre R',fontWeight:550 }}),
        setCellHeaderProps: () => ({ style: { textAlign:'center',fontSize:22,height:'65px',letterSpacing:'2px',backgroundColor:'var(--first-color)',color:'#fff',fontFamily:'Calibre M'}}),
        sort:false   } },
        { name:"Last Checked", options: { filterOptions: { fullWidth: true },
     
        setCellProps: () => ({ style: { textAlign:'left',width:"20%",fontSize:18,backgroundColor:'var(--gray-color)',letterSpacing:'2px',color:'var(--heading-color)',fontFamily:'Calibre R',fontWeight:550 }}),
        setCellHeaderProps: () => ({ style: { textAlign:'center',fontSize:22,height:'65px',letterSpacing:'2px',backgroundColor:'var(--first-color)',color:'#fff',fontFamily:'Calibre M'}}),
        sort:true   } },
        
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
    return (
        <section className='d-flex align-items-start form' style={{ minHeight: window.innerWidth > 800 ? "78vh" : "76vh", paddingTop: "30px", flexDirection: 'column' }}>

            <motion.div
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: .5 }}
            >
                <h1 className='display-5' style={{ fontFamily: "Calibre M", lineHeight: 1.1, color: "var(--heading-color)", marginBottom: "-2px", letterSpacing: "-0.2px", marginTop: window.innerWidth > 700 ? "5px" : "10px" }}>Dashboard</h1>
                <div className='pos-rel' style={{ paddingBottom: "24px" }}>
                    <img src={img2} alt="" style={{ filter: "grayScale(1) opacity(0.6) drop-shadow(0 0 0 var(--first-color))" }} />
                </div>
              {isloading===0?  <div className="text-center"><div className="spinner-border text-secondary spinner-border " role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            </div>
            :
             <div className='container'>
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
