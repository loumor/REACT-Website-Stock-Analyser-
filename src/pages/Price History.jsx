import React from "react";
import { Button, Badge } from "reactstrap"; 
import { useState, useEffect } from "react";
import { symbolSearch, symbolSearchBool, setSymbolSearchBool } from "../variableSet.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { VictoryChart, VictoryZoomContainer, VictoryLine, VictoryTheme, VictoryAxis} from 'victory';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";


export default function PriceHistory() {
  if (JSON.parse(localStorage.getItem('loginApproved'))) {
    return(
      <LoggedIN/> 
    );
  } else {
    return (
      <NotLoggedIN/> 
    );
  }
}

function NotLoggedIN() {
  return (
    <h2 className = "notLoggedIn"><Badge color = "warning">Please Login!</Badge><h4>To access this feature you must be a registered user.</h4></h2>
  );
}


function Graphdraw(props) {
  const [graphingChoice, setGraphingChoice] = useState("close"); // Set the inital graph to 'close price'
  let stockSearchName  = " "; 
  let stockSearchSymbol = " ";
  let graphData = []; // Hold the data specific to user chosen graph 
  let volumeData = [];  // Hold the volume data
  let maxGraphBoundary = Math.max.apply(Math, props.stockData.map(function(o) { return o.high; })); // Find the largest number in the graph 
  let minGraphBoundary = Math.min.apply(Math, props.stockData.map(function(o) { return o.low; })); // Find the smallest number in the graph 
  let maxGraphBoundaryVol = Math.max.apply(Math, props.stockData.map(function(o) { return o.volumes; })); // Find the largest volume 
  let minGraphBoundaryVol = Math.min.apply(Math, props.stockData.map(function(o) { return o.volumes; })); // Find the smallest volume 

  // Organise the table 
  const columns = [
    { headerName: "Date YYYY/MM/DD", field: "timestamp", sortable: true, width: 140}, 
    { headerName: "Open ($)", field: "open", sortable: true, width: 140, filter: 'agNumberColumnFilter'}, 
    { headerName: "Close ($)", field: "close", sortable: true, width: 140, filter: 'agNumberColumnFilter'},
    { headerName: "High ($)", field: "high", sortable: true, width: 140, filter: 'agNumberColumnFilter'},
    { headerName: "Low ($)", field: "low", sortable: true, width: 140, filter: 'agNumberColumnFilter'},
    { headerName: "Volumes (# shares)", field: "volumes", sortable: true, width: 155, filter: 'agNumberColumnFilter'}
  ];

  // Set the volume data to the x,y labels 
  for (let i = props.stockData.length-1; i >= 0; i--) {
    volumeData.push({x: props.stockData[i].timestamp, y: props.stockData[i].volumes});
  } 

  // Set the graph data to the x,y labels 
  for (let i = props.stockData.length-1; i >= 0; i--) {
    graphData.push({x: props.stockData[i].timestamp, y: props.stockData[i][graphingChoice]});
    stockSearchName = props.stockData[i].name;
    stockSearchSymbol = props.stockData[i].symbol;
  } 

  return (
    <div className = "containerPrice">

      <h5>Resutls for: <u>{ stockSearchName } ({ stockSearchSymbol })</u></h5>
      
      <div // Set up the Table 
      className="ag-theme-balham"
      style = { { width: '70%' } }>

      <AgGridReact className = "tablePrice"
      columnDefs={ columns } 
      rowData={ props.stockData }
      pagination = { true } 
      paginationPageSize={ 50 }
      rowSelection = 'single'
      />
      </div>

      <div className = "graphingArea">
        <div className = "graphStock"> 
          <div className = "selectBox">
            <select id="cars" name="cars" onChange = { e => {
              setGraphingChoice(e.target.value); // Grab user choice for graph type
            }}>
              <option value="close">Close Price VS Date</option>
              <option value="open">Open Price VS Date</option>
              <option value="high">Highs Price VS Date</option>
              <option value="low">Lows Price VS Date</option>
            </select>
          </div>
          <VictoryChart 
            padding={ { top: 5, bottom: 100, right: 50, left: 50 } }
            theme={ VictoryTheme.material }
            height={ 450 }
            width={ 500 }
            containerComponent={
              <VictoryZoomContainer/>
            }
          >

            <VictoryAxis
              label="Time (24hr)"
              standalone={ false }
              style={{
                axisLabel: { fontSize: 10, padding: 85 },
                tickLabels: { angle: 90, padding: 35 }
              }}
            />

            <VictoryAxis dependentAxis
              domain = { [(minGraphBoundary*0.95), (maxGraphBoundary*1.05)] }
              orientation="left"
              standalone={ false }
              label="Price ($)"
              style={{
                axisLabel: { fontSize: 10, padding: 35 }
              }}
            />

            <VictoryLine
              interpolation="monotoneX"
              scale={ {x: "time", y: "linear"} }
              standalone={ false }
              domain={{
                y: [(minGraphBoundary*0.95), (maxGraphBoundary*1.05)]
              }}
              style={{
                data: { stroke: "#c43a31" },
                parent: { border: "1px solid #ccc" }
              }}
              data={ graphData }
            />    

          </VictoryChart>
        </div>

        <div className = "volumeGraph">
          <div className = "titleVolume">
              <h5>Volume VS Date</h5>
          </div>
          <VictoryChart 
            padding={ { top: 5, bottom: 100, right: 50, left: 80 } }
            theme={ VictoryTheme.material }
            height={ 450 }
            width={ 500 }
            containerComponent={
              <VictoryZoomContainer/>
            }
            >

            <VictoryAxis
              label="Time (24hr)"
              standalone={ false } 
              style={{
                axisLabel: { fontSize: 10, padding: 85 },
                tickLabels: { angle: 90, padding: 35 }
              }}
            />

            <VictoryAxis dependentAxis
              domain={ [(minGraphBoundaryVol*0.95), (maxGraphBoundaryVol*1.05)] }
              orientation="left"
              label="# of Shares"
              standalone={false}
              style={{
                axisLabel: { fontSize: 10, padding: 70 }
              }}
            />
            
            <VictoryLine
              data={ volumeData }
              interpolation="monotoneX"
              scale={ { x: "time", y: "linear" } }
              standalone={false}
              domain={{
                y: [(minGraphBoundaryVol*0.95), (maxGraphBoundaryVol*1.05)]
              }}
              style={{
                data: { stroke: "#0000FF" },
                parent: { border: "1px solid #ccc" }
              }}
            />  
          </VictoryChart>
        </div>
      </div>
    </div>
  );
}

function LoggedIN() {
  const [stockName, setStockName] = useState(); // Hold stock symbol's name 
  const [error, setError] = useState(null); // Hold error state 
  const [stockData, setStockData] = useState([]); // Data from the API search 
  const [query, setQuery] = useState(""); // Searched stock symbol 
  const [startYYYYMMDD, setStartYYYYMMDD] = useState(new Date("2019/11/06"));  // Hold for start date 
  const [endYYYYMMDD, setEndYYYYMMDD] = useState(new Date(startYYYYMMDD)); // Hold for end date 
  const [searchHasOccured, setSearchHasOccured] = useState(false); // Sets when the user has searched 
  const [chartVisible, setChartVisible] = useState(false); // Sets the visbility of the chart 
  

  useEffect(() => {
    let headers = new Headers();
    headers.append('Authorization', localStorage.getItem('tokentypeValue') + " " + localStorage.getItem('tokenValue'));
    let convertedStart;
    let convertedEnd;

    // Convert the dates to the correct format 
    if (searchHasOccured) {
      convertedStart = startYYYYMMDD;
      convertedStart = convertedStart.toISOString();
      convertedStart = convertedStart.substring(0,10);
      convertedEnd = endYYYYMMDD;
      convertedEnd = convertedEnd.toISOString();
      convertedEnd = convertedEnd.substring(0,10);

      const requestOptions = {
        method: 'GET',
        headers: headers,
      };
      fetch(`http://131.181.190.87:3000/stocks/authed/${query}?from=${convertedStart}T14%3A00%3A00.000Z&to=${convertedEnd}T15%3A00%3A00.000Z`, requestOptions) 
        .then(response => response.json())
        .then(data => 
          data.map(stocks => {
            setChartVisible(true)
            return {
              timestamp: stocks.timestamp.substring(0,10),
              symbol: stocks.symbol,
              name: stocks.name,
              industry: stocks.industry,
              open: stocks.open,
              high: stocks.high,
              low: stocks.low,
              close: stocks.close,
              volumes: stocks.volumes
            };
          })
        )
        .then(data => setStockData(data))
        .catch((error) => {
          setChartVisible(false)
          setError("Incorrect Stock Symbol or Date Range")
        });
      setSearchHasOccured(false); 
    }

  }, [query, startYYYYMMDD, endYYYYMMDD, searchHasOccured]);

  return (
    <div className="containerPriceHistory">
      <h1 className = "priceHistoryTitle">Storcks Price History Search</h1>
      <div className="searchSectionPriceHistory">
          <div className = "startDataSelector">
            <h7>Select Start Date:</h7> 
            <DatePicker  
              selected={ startYYYYMMDD } 
              onChange={ date => setStartYYYYMMDD(date) } 
              dateFormat="dd/MM/yyyy"
              minDate={ new Date("2019/11/06") }
              maxDate={ new Date("2020/03/24") }
              startDate={ startYYYYMMDD }
            />
          </div>
          <div className = "startDataSelector">
            <h7>Select End Date:</h7> 
            <DatePicker  
              selected={ endYYYYMMDD } 
              onChange={ date => setEndYYYYMMDD(date) } 
              dateFormat="dd/MM/yyyy"
              minDate={ new Date(startYYYYMMDD) }
              maxDate={ new Date("2020/03/24") }
              startDate={ endYYYYMMDD }
            />
          </div>

          <label className = "labelStockSymbol" htmlFor="name"> Stock Symbol: </label>
          <input
            className = "inputSection"
            type="text"
            name="name"
            id="name"
            maxLength="5" // No more then 5 characters 
            value={ symbolSearchBool ? symbolSearch : stockName } // If the user has selected a stock symbol from the Stocks page pass that to value 
            onChange={ event => {
              const { value } = event.target;
              setSymbolSearchBool(false); // Set this to false so 'value' doesn't get stuck in a loop 

              if (/[^a-z]/gi.test(value)) { // Check that only letters are in the search
                setError("Symbols should only contain letters!");
              } else {
                setError(null);
                let uppercaseValue =  value.toUpperCase(); // Make sure its uppercase 
                setStockName(uppercaseValue);
              }
            }}/>
            
          <Button 
          className = "pageButton"
          color = "info"
          size = "sm"
          onClick = { event => {
            setQuery(stockName); // Send off the search 
            setStockName(""); // Clear the search bar 
            setError(null); // Remove any errror
            setSearchHasOccured(true);

          }}>Submit </Button>
          { error != null ? <p className = "searchError"><Badge color = "danger">Error: </Badge> { error }</p> : null }
        </div>
        {/* Only show graph once search has been completed without error */}
        { chartVisible !== false ? <Graphdraw stockData={stockData} /> : false } 
    </div>

  );
}
