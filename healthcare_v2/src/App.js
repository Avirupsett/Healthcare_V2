import Sidebar from "./components/Sidebar";
import React, { useEffect, useState } from "react";
import './App.css'
import {
  BrowserRouter as Router,
} from "react-router-dom";
import Observer from 'fontfaceobserver';
import Lottie from "lottie-react";
import loader from "./assets/119950-loader.json"

function App() {
  const [loading, setloading] = useState(1)
  const [loadfont, setloadfont] = useState(1)
  const HeadingFont = new Observer('Domain Dis');
  const CalibreR = new Observer('Calibre R');
  const CalibreM = new Observer('Calibre M');
  const CalibreS = new Observer('Calibre S');
  const SFMono = new Observer('SF Mono');


  useEffect(() => {
    setTimeout(() => {
      setloading(0);
    }, 3500);
  }, []);

  HeadingFont.load().then(() => {

    CalibreR.load().then(() => {

      CalibreM.load().then(() => {

        CalibreS.load().then(() => {

          SFMono.load().then(() => {
            setloadfont(0)
          });
        });
      });
    });
  });

  return (

    <div className="App">

      {loading === 0 && loadfont===0? <Router>
        <Sidebar />
      </Router> : <div className="d-flex align-items-center justify-content-center" style={{ height:window.innerWidth > 600 ? "100vh":"90vh" }}>
        <Lottie animationData={loader} style={{ width: window.innerWidth > 600 ? "30%" : "90%" }} loop={true} />
      </div>}
    </div>

  );
}

export default App;
