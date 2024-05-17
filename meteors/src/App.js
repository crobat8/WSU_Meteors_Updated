import React, { useState, useEffect } from 'react';
import BarGraph from './BarGraph';
import getContinent from './getContinent';
import './App.scss';

function App() {
  const [data, setData] = useState([]);
  const [average,setAverage] = useState(0);
  const [classes,setClasses] = useState([]);
  const [classTotals,setClassTotals] = useState();
  const [classCounts,setClassCounts] = useState();
  const [classAverages,setClassAverages] = useState();
  const [hemisphereAverages,setHemisphereAverages] = useState([0,0,0,0,0]);
  const [hemisphereCounts,setHemisphereCounts] = useState([0,0,0,0,0]);
  const [relictAverage,setRelictAverage] = useState(0);
  const [continentCount,setContinentCount] = useState({});
  const [meteortieFrequency,setMeteortieFrequency]=useState({});
  const [continentClassCondenced,setContinentClassCondenced] = useState({});
  const [foundData,setFoundData] = useState();
  const [fellData,setFellData] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(process.env.PUBLIC_URL + '/Meteorite_Landings.csv');
        const csvData = await response.text();
        const parsedData = await parseMeteorData(csvData);
        setData(parsedData);
      } catch (error) {
        console.error('Error fetching/parsing CSV file:', error);
      }
    }
    fetchData();
  }, []); 

  useEffect(()=>{
    function getClasses (){
      const classList = []
      for (let i = 0; i <= data.length-1; i++) {
        classList.push(data[i].recclass);
      }
      const noDuplicates = [...new Set(classList)];
      noDuplicates.sort();
      setClasses(noDuplicates);
    }
    getClasses();

    function getAverage (){
      let total = 0;
      let countedMeteors = 0;
      for (let i = 0; i <= data.length-1; i++) {
        const currentMass = parseFloat(data[i].mass);
        if(!isNaN(currentMass)){
          total += currentMass;
          countedMeteors++;
        }
      }
      setAverage(total/countedMeteors);
    }
    getAverage();

    function calculateAverages(){//[center,north,east,south,west]
      let totals = [0,0,0,0,0];
      let totalsCounts = [0,0,0,0,0];
      for (let i = 0; i <= data.length-1; i++) {
        const currentMass = parseFloat(data[i].mass);
        let center = false;
        if(data[i].mass != ""){
          if(data[i].reclat == 0 && data[i].reclong == 0){//center
            totals[0] += currentMass;
            totalsCounts[0]++;
            center = true;
          }
          if(data[i].reclat >= 0 && !center){//north
            totals[1] += currentMass;
            totalsCounts[1]++;
          }
          if(data[i].reclong >= 0 && !center){//east
            totals[2] += currentMass;
            totalsCounts[2]++;
          }
          if(data[i].reclat < 0 && !center){//south
            totals[3] += currentMass;
            totalsCounts[3]++;
          }
          if(data[i].reclong < 0 && !center){//west
            totals[4] += currentMass;
            totalsCounts[4]++;
          }
        }
        
      }
      const averagesCalculated = 
      [totals[0]/totalsCounts[0],
      totals[1]/totalsCounts[1],
      totals[2]/totalsCounts[2],
      totals[3]/totalsCounts[3],
      totals[4]/totalsCounts[4]];
      setHemisphereAverages(averagesCalculated);
      setHemisphereCounts(totalsCounts);
    }
    calculateAverages();

    function countFellsVSFalls(){
      let fellCounts = {};
      let foundCounts = {};
      for (let i = 0; i <= data.length-1; i++) {
        if(isNaN(foundCounts[data[i].year])){
          foundCounts[data[i].year] = 0;
        }
        if(isNaN(fellCounts[data[i].year])){
          fellCounts[data[i].year] = 0;
        }
        if(data[i].fall == "Fell"){
          fellCounts[data[i].year]++;
        }else if(data[i].fall == "Found"){
          foundCounts[data[i].year]++;
        }
      }
      setFellData(fellCounts);
      setFoundData(foundCounts);
    }
    countFellsVSFalls();

    function calculateAverageOfClass(classification){
      let totals = {};
      let totalsCount = {};
      for (let i = 0; i <= data.length-1; i++) {
        const currentMass = parseFloat(data[i].mass)
        if(isNaN(totals[data[i].recclass])){
          totals[data[i].recclass]=0;
        }
        if(isNaN(totalsCount[data[i].recclass])){
          totalsCount[data[i].recclass]=0;
        }
        if(data.recclass == classification && data[i].mass != ""){
          totals[data[i].recclass] += currentMass;
          totalsCount[data[i].recclass] ++;
        }
      }
      setClassTotals(totals);
      setClassCounts(totalsCount);
      let averagesForClass = {};

      for (let key in totals) {
        if(totals[key] != 0){
          averagesForClass[key] = totals[key]/totalsCount[key]; 
        }else{
          averagesForClass[key] = 0;
        }
      }
      setClassAverages(averagesForClass);
    }
    calculateAverageOfClass();

    function nameTypes(){
      let relictTotal = 0;
      let relictCount = 0;
      for (let i = 0; i <= data.length-1; i++) {
        const currentMass = parseFloat(data[i].mass);
        if(data[i].nametype == "Relict"){
          if(!isNaN(currentMass)){
            relictTotal += currentMass;
            relictCount++;  
          }
          
        }
      }
      setRelictAverage(relictTotal/relictCount);
    }
    nameTypes();

    function findTopValues(obj,amount) {
      const values = Object.values(obj);
      values.sort((a, b) => b - a);
      const topValues = values.slice(0, amount);
      const topObj = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key) && topValues.includes(obj[key])) {
          topObj[key] = obj[key];
        }
      }
      return topObj;
    }

    function sortByContenient(){
      const localContinentCounts = {
        Africa:0,
        Asia:0,
        Australia:0,
        Europe:0,
        North_America:0,
        South_America:0,
        unknown:0,
      };
      const continenetsClassFrequency = {
        Africa:{},
        Asia:{},
        Australia:{},
        Europe:{},
        North_America:{},
        South_America:{},
        unknown:{},
      };
      for (let i = 0; i <= data.length-1; i++) {
        const continent = getContinent(parseFloat(data[i].reclat),parseFloat(data[i].reclong));
        localContinentCounts[continent]++;
        if(isNaN(continenetsClassFrequency[continent][data[i].recclass])){
          continenetsClassFrequency[continent][data[i].recclass]=0;
        }
        continenetsClassFrequency[continent][data[i].recclass]++;
      }
      setContinentCount(localContinentCounts);
      const condenceDownTo=10;
      const continenetsClassFrequencyCondenced = {
        Africa:findTopValues(continenetsClassFrequency.Africa,condenceDownTo),
        Asia:findTopValues(continenetsClassFrequency.Asia,condenceDownTo),
        Australia:findTopValues(continenetsClassFrequency.Australia,condenceDownTo),
        Europe:findTopValues(continenetsClassFrequency.Europe,condenceDownTo),
        North_America:findTopValues(continenetsClassFrequency.North_America,condenceDownTo),
        South_America:findTopValues(continenetsClassFrequency.South_America,condenceDownTo),
      }
      setContinentClassCondenced(continenetsClassFrequencyCondenced);
      const scaler = 1000
      const localMeteoriteFrequency = {
        Africa:(localContinentCounts.Africa/29648481)*scaler,
        Asia:(localContinentCounts.Asia/31033131)*scaler,
        Australia:(localContinentCounts.Australia/8486460)*scaler,
        Europe:(localContinentCounts.Europe/22134710)*scaler,
        North_America:(localContinentCounts.North_America/21330000)*scaler,
        South_America:(localContinentCounts.South_America/17461112)*scaler,
      }
      setMeteortieFrequency(localMeteoriteFrequency)
    }
    sortByContenient();
  },[data]);

  async function parseMeteorData(csvData) {
    const lines = csvData.trim().split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === '') continue; 
  
      const values = [];
      let currentField = '';
      let insideQuotes = false;
  
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
  
        if (char === '"') {
          insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
          values.push(currentField.trim());
          currentField = '';
        } else {
          currentField += char;
        }
      }
  
      values.push(currentField.trim());
  
      const rowObject = {};
      for (let k = 0; k < headers.length; k++) {
        rowObject[headers[k]] = values[k];
      }
  
      result.push(rowObject);
    }
    return result;
  }

  function roundToHundredth(num) {
    return Math.round(num * 100) / 100;
  }
  if(data == []){
    return(
      <h1>
        loading data
      </h1>
    )
  }
  return (
    <div className="App">
      <div className='DataDisplay'>
        <h1>
          Total average
        </h1>
        <p>
          average mass: {roundToHundredth(average)} (g)
        </p>
        
        <div>
          <div>
            <h2>
              northern Hemisphere information
            </h2>
            <p>
              average mass: {roundToHundredth(hemisphereAverages[1])} (g)
            </p> 
            <p>
              total Meteorites: {hemisphereCounts[1]} 
            </p>
          </div>
          
          <div>
            <h2>
              Southern Hemisphere information
            </h2>
            <p>
              average mass: {roundToHundredth(hemisphereAverages[3])} (g)
            </p> 
            <p>
              total Meteorites: {hemisphereCounts[3]} 
            </p>
          </div>

          <div>
            <h2>
              Eastern Hemisphere information
            </h2>
            <p>
              average mass: {roundToHundredth(hemisphereAverages[2])} (g)
            </p> 
            <p>
              total Meteorites: {hemisphereCounts[2]} 
            </p>
          </div>
          
          <div>
            <h2>
              Western Hemisphere information
            </h2>
            <p>
              average mass: {roundToHundredth(hemisphereAverages[4])} (g)
            </p>
            <p>
              total Meteorites: {hemisphereCounts[4]}
            </p>
          </div>
        </div>

        

      </div>
      <div>
        <h2>found meteorites vs fell meteorites counts </h2>
        <h3>found meteorites</h3>
        <BarGraph data={foundData} sortByValue={false}/>
        <h3>fell meteorites</h3>
        <BarGraph data={fellData} sortByValue={false}/>
      </div>
      
      <div>
        <h2>average mass based on meteorite classification</h2>
        <BarGraph data={classAverages} sortByValue={false}/>
        {classes.map((classification, index) => (
          <div>
            <h3>{classification}</h3>
            <p>average:{roundToHundredth(classTotals[classification]/classCounts[classification])}</p>
          </div>
        ))}
      </div>
      <div>
        <h2>
          relict average mass
        </h2>
        <p>
          {relictAverage} (g)
        </p>
      </div>
      <div>
        <h2>counts of meteorites on different continenets</h2>
        <BarGraph data={continentCount} sortByValue={false}/>
        <h2>frequency of meteorites on different continenets (per 1000 square killometers)</h2>
        <BarGraph data={meteortieFrequency} sortByValue={false}/>
      </div>
      <div>
        <h1>meteorite classifications by continenets (top 10)</h1>
        <h2>
          Africa
        </h2>
        <BarGraph data={continentClassCondenced.Africa} sortByValue={true} />
        <h2>
          Asia
        </h2>
        <BarGraph data={continentClassCondenced.Asia} sortByValue={true} />
        <h2>
          Australia
        </h2>
        <BarGraph data={continentClassCondenced.Australia} sortByValue={true} />
        <h2>
          Europe
        </h2>
        <BarGraph data={continentClassCondenced.Europe} sortByValue={true} />
        <h2>
          North_America
        </h2>
        <BarGraph data={continentClassCondenced.North_America} sortByValue={true} />
        <h2>
          South_America
        </h2>
        <BarGraph data={continentClassCondenced.South_America} sortByValue={true}/>
      </div>
    </div>
  );
}

export default App;
