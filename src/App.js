import React, { useState, useEffect } from 'react';
import './App.css';
import { FormControl, Select, MenuItem, Card, CardContent } from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { prettyPrintStat, sortData } from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [caseType, setCaseType] = useState('cases');
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await fetch('https://disease.sh/v3/covid-19/all')
        .then(response => response.json())
        .then(data => {
          setCountryInfo(data);
        });
    }
    fetchData();
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then(response => response.json())
        .then(data => {
          const countries = data.map(country => (
            {
              name: country.country,
              value: country.countryInfo.iso2
            }
          ));
          const sortedData = sortData(data);
          setCountries(countries);
          setTableData(sortedData);
          setMapCountries(data);
        })
    }
    getCountriesData();
  }, []);

  const handleCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url = countryCode === 'worldwide'
      ? 'https://disease.sh/v3/covid-19/all'
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);
        const points = countryCode === 'worldwide' ?
          [34.80746, -40.4796] : [data.countryInfo.lat, data.countryInfo.long]
        setMapCenter(points);
        setMapZoom(4);
      });
  }

  return (
    <div className="app">
      <div className='app_left'>
        <div className='app_header'>
          <h1>COVID-19 TRACKER</h1>
          <FormControl className='app_dropdown'>
            <Select
              variant='outlined'
              value={country}
              onChange={handleCountryChange}
            >
              <MenuItem value='worldwide'>Worldwide</MenuItem>
              {countries.map(country => (
                <MenuItem value={country.value} key={country.name}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className='app_stats' >
          <InfoBox
            isRed
            active={caseType === 'cases'}
            title='Coronavirus Cases'
            total={prettyPrintStat(countryInfo.cases)}
            cases={prettyPrintStat(countryInfo.todayCases)}
            onClick={() => { setCaseType('cases') }}
          />
          <InfoBox
            active={caseType === 'recovered'}
            title='Recovered'
            total={prettyPrintStat(countryInfo.recovered)}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            onClick={() => { setCaseType('recovered') }}
          />
          <InfoBox
            isRed
            active={caseType === 'deaths'}
            title='Deaths'
            total={prettyPrintStat(countryInfo.deaths)}
            cases={(prettyPrintStat(countryInfo.todayDeaths))}
            onClick={() => { setCaseType('deaths') }}
          />
        </div>

        <Map center={mapCenter} zoom={mapZoom} countries={mapCountries} casesType={caseType} />
      </div>
      <Card className='app_right'>
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3 className='app_graphTitle'>Worldwide new {caseType}</h3>
          <LineGraph className='app_graph' country={country} casesType={caseType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
