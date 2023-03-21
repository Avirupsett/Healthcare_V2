import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { BiChevronRight } from 'react-icons/bi';
import encoded from '../Form Components/disease_description_encoded.json'
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function ControlledAccordions(props) {
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    const history = useHistory()

    const handleSubmit = (val,index) => {
        if(val==="Heart Disease"){
            sessionStorage.setItem("Disease",index)
            history.push("/heartform/details")
        }
        else if(val==="Diabetes"){
            sessionStorage.setItem("Disease",index)
            history.push("/diabetesform/details")
        }
        else{
            Swal.fire("Service Unavailable 😔","We are only providing advanced diagnosis for Diabetes and Heart Disease.","info")
        }

    }

    return (
        <div className='mb-5 me-lg-5'>
            {props.multi.map((val,index) => {
                return (
                    <Accordion style={{background: "var(--black-bg)"}} key={val} expanded={expanded === `panel${index}`} onChange={handleChange(`panel${index}`)}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1bh-content"
                            // id="panel1bh-header"
                        >
                            <Typography className='fs-3 pe-1' style={{ fontFamily: "Calibre R", color: "var(--first-color)", letterSpacing: '1.2px', minWidth: "max-content", fontWeight: 600, }} sx={{ width: "10%", flexShrink: 0 }}>
                               {index+1}. Disease :
                            </Typography>
                            <Typography className='fs-3 pe-2' style={{ fontFamily: "Calibre R",width: '-webkit-fill-available', }} sx={{ color: "var(--text-color)" }}>{encoded[val].Disease}  {index===0?<span style={{ fontFamily: "Calibre R",float:'right' }} className="badge badge-danger">High</span>:<span style={{ fontFamily: "Calibre R",float:'right' }} className="badge badge-warning">Low</span>}</Typography>
                           
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography className='fs-4 d-flex align-items-start' style={{ fontFamily: "Calibre R", color: "var(--text-color)" }}>
                                <div className='fs-4 pe-1' style={{ fontFamily: "Calibre R", color: "var(--first-color)", letterSpacing: '1.2px', minWidth: "max-content", fontWeight: 600, }}>Description : </div>
                                <div> {encoded[val].Symptom_Description}</div>
                            </Typography>
                            <div className='d-flex'>
                            <div className='me-3' style={{}}>
                            <a href={`https://www.google.com/search?q=${encoded[val].Disease}`} rel="noreferrer" target='_blank' type="button" className="bg btn btn-outline-primary rounded-9  btn_hover ms-auto me-auto me-4 my-4 btn_hover" data-mdb-ripple-color="var(--first-color)" style={{ background: "var(--black-bg)",border:"1.5px solid", borderColor: "var(--first-color)", padding: "9px 20px", fontSize: "15px", color: 'var(--first-color)', fontFamily: 'SF Mono' }}>Learn More</a>
                            </div>
                            <div className='' style={{}}>
                                <button onClick={()=>{handleSubmit(encoded[val].Disease,val)}} type="button" className="btn btn-primary rounded-9 ms-auto me-auto me-4 my-4 btn_hover" data-mdb-ripple-color="var(--first-color)" style={{ background: "var(--first-color) var(--mdb-gradient)", borderColor: "var(--first-color)", padding: "9px 20px", fontSize: "15px", color: '#FFF', fontFamily: 'SF Mono' }}>Advanced Diagnosis <BiChevronRight size={24} style={{ verticalAlign: "-7.5px" }} /> </button>
                            </div>
                            </div>
                        </AccordionDetails>
                    </Accordion>

                )

            })
            }
         

            <Accordion style={{background: "var(--black-bg)"}} expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel4bh-content"
                    id="panel4bh-header"
                >
                    <Typography style={{ fontFamily: "Calibre R", color: "var(--first-color)", letterSpacing: '1.2px', minWidth: "max-content", fontWeight: 600, }} className='fs-3' sx={{ width: '33%', flexShrink: 0 }}>Symptoms</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography className='fs-4' style={{ fontFamily: "Calibre R", color: "var(--text-color)" }}>
                        {sessionStorage.getItem("Selected")}
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}