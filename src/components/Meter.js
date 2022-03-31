import React from 'react'
import "../styles/Meter.css";
import CountUp from 'react-countup';

function Meter({ label, stat, color }) {
    return (
        <div className='meter'>
            <div className='meter-title' style={{ backgroundColor: color, padding: '3%' }} >{label}</div>
            <div className='meter-stat' style={{ paddingTop: '6%', paddingLeft: '3%' }}><CountUp end={stat} duration={2} /></div>
        </div>
    )
}

export default Meter