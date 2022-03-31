import { React, memo } from 'react'
import '../styles/TableList.css'

function TableList({ countries }) {

    const bgColor = {
        backgroundColor: '#121212',
        margin: '0px 5px'
    }

    const line = {
        height: '0.2px',
        backgroundColor: '#868585'
    }

    return (
        <div className='table'>
            <p>Live Cases</p>
            <div className='table-inner'>
                {countries.map((country, index) => (
                    <div style={bgColor} key={index} >
                        <div >
                            <tr >
                                <td className='td1'>{index + 1}. {country.country}</td>
                                <td className='td'>
                                    <strong>{country.cases}</strong>
                                </td>
                            </tr>
                        </div>
                        <div style={line}></div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default memo(TableList)