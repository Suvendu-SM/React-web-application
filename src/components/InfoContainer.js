import React, { useEffect, useState } from 'react'
import GraphVisual from './GraphVisual'
import Meter from './Meter'
import TableList from "./TableList";
import Calendar from './Calender'
import CountrySelect from "./CountrySelect";
import axios from 'axios'
import '../styles/InfoContainer.css'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

const getNewDate = (day) => {
    let newDate = new Date();
    newDate.setDate(newDate.getDate() - day);

    let date = newDate.getDate()
    let month = newDate.getMonth()
    let year = newDate.getFullYear()

    date = date < 10 ? '0' + date : date
    month = month < 10 ? '0' + month : month

    newDate = year + '-' + month + '-' + date
    return newDate
}

const getOptions = (_country, day) => {
    return {
        method: 'GET',
        url: 'https://covid-193.p.rapidapi.com/history',
        params: { country: _country, day: day },
        headers: {
            'X-RapidAPI-Host': 'covid-193.p.rapidapi.com',
            'X-RapidAPI-Key': 'd38a2378f8msh8da92d7030ea7fep1d9601jsnc850e1c0eaa0'
        }
    }
}

function InfoContainer() {

    const [country, setCountry] = useState('Worldwide')
    const [countryCode, setCountryCode] = useState('wof')
    const [date, setDate] = useState('')
    const [active, setActive] = useState()
    const [recovered, setRecovered] = useState()
    const [deaths, setDeaths] = useState()
    const [tableData, setTableData] = useState([]);
    const [dataSet, setDataSet] = useState([])
    const [open, setOpen] = useState(true);

    const options_2 = {
        method: 'GET',
        url: 'https://covid-193.p.rapidapi.com/history',
        params: { country: `${country}`, day: `${date}` },
        headers: {
            'X-RapidAPI-Host': 'covid-193.p.rapidapi.com',
            'X-RapidAPI-Key': 'd38a2378f8msh8da92d7030ea7fep1d9601jsnc850e1c0eaa0'
        }
    };

    const options_1 = {
        method: 'GET',
        url: 'https://disease.sh/v3/covid-19/all'
    }

    useEffect(() => {
        const request_body = countryCode === 'wof' ? options_1 : options_2;

        axios.request(request_body).then((response) => {
            if (countryCode === 'wof') {
                const filter = response.data
                setActive(filter.active)
                setRecovered(filter.recovered)
                setDeaths(filter.deaths)
            } else {
                const filter = response.data
                setActive(filter.response[0]?.cases.active)
                setRecovered(filter.response[0]?.cases.recovered)
                setDeaths(filter.response[1]?.deaths.total)
            }
        }).catch(function (error) {
            console.error(error);
        });

        fetch("https://disease.sh/v3/covid-19/countries")
            .then((response) => response.json())
            .then((data) => {
                const sortedData = [...data]
                sortedData.sort((a, b) => b.cases - a.cases)
                setTableData(sortedData)
            });

    }, [countryCode, date]);


    useEffect(() => {
        const fetchCountryData = async () => {

            const promise = []
            for (let day = 20; day > 0; day--) {
                const request_body = getOptions(country, getNewDate(day))

                await axios.request(request_body).then((response) => {
                    promise.push(response.data.response)
                }).catch(function (error) {
                    console.error(error);
                });
            }

            Promise.all(promise).then(res => {
                setDataSet(res)
                setOpen(false)
            })
        }
        fetchCountryData()
    }, [country])

    const onCountryChange = (code, label) => {
        setCountryCode(code)
        setCountry(label)
        setOpen(true)
    }

    const onDateChange = (newDate) => {
        setDate(newDate)
    }

    return (
        <div className='info-m'>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className='info-container'>
                <div className='info-subcontainer'>
                    <div className='info-m1'>
                        <CountrySelect country={onCountryChange} />
                        <Calendar setDateFun={onDateChange} />
                    </div>
                    <div className='info-container-meter'>
                        <Meter label={'Active'} stat={active} color={'#0077ff'} />
                        <Meter label={'Recovered'} stat={recovered} color={'green'} />
                        <Meter label={'Death'} stat={deaths} color={'Red'} />
                    </div>
                    <GraphVisual CountrySelect={country} countryInfo={dataSet} caseType={'cases'} subData={'total'} label={'Cases'} />
                </div>
                <div className='info-subcontainer'>
                    <GraphVisual CountrySelect={country} countryInfo={dataSet} caseType={'cases'} subData={'recovered'} label={'recovered'} />
                    <GraphVisual CountrySelect={country} countryInfo={dataSet} caseType={'deaths'} subData={'total'} label={'deaths'} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }} >
                    <TableList countries={tableData} />
                    <GraphVisual CountrySelect={country} countryInfo={dataSet} caseType={'tests'} subData={'total'} label={'tests'} />
                </div>

            </div>
        </div>
    )
}

export default InfoContainer