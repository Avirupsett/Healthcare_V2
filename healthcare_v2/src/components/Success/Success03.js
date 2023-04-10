import { initializeApp } from 'firebase/app';
import { Timestamp, addDoc, collection, doc, getCountFromServer, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import Swal from 'sweetalert2'

export default function Success01() {
    const history = useHistory()
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
    async function read_data() {
        try {
            
            const q = query(collection(db, "payment"), where("uid", "==", sessionStorage.getItem("userid")));
            const snapshot = await getCountFromServer(q);
            if (snapshot.data().count > 0) {
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((document) => {
                updateDoc(doc(db, "payment", document.id), {
                    plan: "Premium",
                    time: Timestamp.now(),
                    validity: 30
                });
                console.log(document.id)
            })
            }
            else {
                add_data()
            }

        }
        catch (e) {

        }
    }
    async function add_data() {
        try {
            const docRef = await addDoc(collection(db, "payment"), {
                uid: sessionStorage.getItem("userid"),
                email: sessionStorage.getItem("user_email"),
                plan: "Premium",
                time: Timestamp.now(),
                validity: 30
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
    const redirect = () => {
        Swal.fire('Payment Successful', 'The Premium Plan will expire after 30 days', 'success').then((result) => {
            sessionStorage.setItem("plan", "Premium")
            sessionStorage.setItem("days_left", 30)
            read_data()
            if (result.isConfirmed) {
                history.replace('/')
            }
            else {
                history.replace('/')
            }

        })
    }
    const [load, setload] = useState(0)
    useEffect(() => {
        if (load === 0) {
            redirect()
            setload(1)
        }
    }, [load,redirect])

    return (
        <div></div>
    )
}
