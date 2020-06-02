import React from "react";
import { useState, useEffect } from "react";
import { Button, Badge } from "reactstrap"; 
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import Table from 'react-bootstrap/Table'
import { VictoryChart, VictoryLine, VictoryTheme, VictoryLabel, VictoryLegend, VictoryAxis} from 'victory';
import { symbolSearch, symbolSearchBool, setSymbolSearchBool } from "../variableSet.js";


export default function Quotes() {
  return (
    <main> 
      <SearchStock />
    </main>
  ); 
}



function SearchStock() {
  const [stockName, setStockName] = useState(""); // Hold user input for stock Symbol 
  const [error, setError] = useState(null); // Hold error state
  const [stockData, setStockData] = useState([]); // Data from the API search 
  const [query, setQuery] = useState(""); // Hold search input for stock Symbol
  const [chartVisible, setChartVisible] = useState(false); // Sets the visbility of the chart 
  const [searchHasOccured, setSearchHasOccured] = useState(false); // Sets when the user has searched 
  
  // Organise the table to display the results 
  const tableData = [
    { headerName: "Stock", data: stockData.name}, 
    { headerName: "Symbol", data: stockData.symbol}, 
    { headerName: "Industry", data: stockData.industry},
    { headerName: "Open", data: stockData.open},
    { headerName: "High", data: stockData.high},
    { headerName: "Low", data: stockData.low},
    { headerName: "Close", data: stockData.close},
    { headerName: "Volumes", data: stockData.volumes}
  ];

  // Organise the open/close data to display for graphing 
  const graphDataOpenClose = [
    {x: "9:30am Open", y: stockData.open},
    {x: "4:30pm Close", y: stockData.close}
  ];

  // Organise the high low data to display for graphing 
  const graphDataHighLow = [
    {x: "9:30am Open", y: stockData.high},
    {x: "4:30pm Close", y: stockData.low}
  ];

  useEffect(() => {
    // Check if the user has sent a query from the Stocks page 
    if (symbolSearchBool) {
      setQuery(symbolSearch);
      setChartVisible(true); // Make the chart visible
      setSymbolSearchBool(false); // Set back to false to avoid re-renders 
    };

    fetch(`http://131.181.190.87:3000/stocks/${query}`)
    .then(res => res.json())
    .then(data => 
        {
          // Check if the symbol searched was incorrect 
          if ((typeof data.symbol === 'undefined') && searchHasOccured) { 
            setChartVisible(false); // Make the chart invisible
            setError("Wrong Symbol! Try Again");
          }
          
          return {
          name: data.name,
          symbol: data.symbol,
          industry: data.industry,
          open: data.open,
          high: data.high,
          low: data.low,
          close: data.close,
          volumes: data.volumes
        }})
    .then(stocks => setStockData(stocks));
    
  }, [query, searchHasOccured]);

  return (
    <div className="containerQuotes">
      <h1 className = "quotesTitle">Stocks Quote Search</h1>
     <div className="searchSection">
        <label className = "labelStockSymbol" htmlFor="name"> Stock Symbol: </label>
        <input
          className = "inputSection"
          type="text"
          name="name"
          id="name"
          maxlength="5" // No more then 5 characters 
          value={ stockName }
          onChange={ event => {
            const { value } = event.target;
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
          setChartVisible(true); // Make the chart visible 
          setSearchHasOccured(true)
        }}>Submit </Button>
        { error != null ? <p className = "searchError"><Badge color = "danger">Error: </Badge> { error }</p> : null }
      </div>

      {/*Set up the table */}
      <div className = "tableDataDiv">
        <Table className = "tableTable" striped bordered hover variant="dark">
          <thead>
            <tr>
                {// Map column names to the table 
              tableData.map(feature => (
                    <th>{feature.headerName}</th>  
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {// Map the data to each of the columns 
              tableData.map(feature => (
                    <td>{feature.data}</td>
              ))}
            </tr>
          </tbody>
        </Table>  
      </div> 

      {/*Set up the chart*/}
      { chartVisible !== false ? 
      <div className = "graphStock"> 
      <VictoryChart 
      theme={ VictoryTheme.material }
      maxDomain={ { y: (stockData.high*1.05) } }
      minDomain={ { y: (stockData.low*0.95) } }
      height={ 250 }
      width={ 300 }
      >
        <VictoryLabel x={ 100 } y={ 24 }
            text="Prices VS Time"
          />

        <VictoryAxis
          label="Time (24hr)"
          style={{
            axisLabel: { fontSize: 10 }
          }}
        />

        <VictoryAxis dependentAxis
          label="Price ($)"
          style={{
            axisLabel: { fontSize: 10, padding: 35 }
          }}
        />
        
        <VictoryLegend x={ 125 } y={ 50 }
            title="Legend"
            centerTitle
            orientation="horizontal"
            gutter={ 20 }
            style={ { border: { stroke: "black" }, title: { fontSize: 5 }, labels: { fontSize: 5 } } }
            data={[
              { name: "Open/Close", symbol: { fill: "#c43a31" } },
              { name: "High/Low", symbol: { fill: "#0000FF" } }
            ]}
          />
        <VictoryLine
          style={{
            data: { stroke: "#c43a31" },
            parent: { border: "1px solid #ccc" }
          }}
          data={ graphDataOpenClose }
          
          />

        <VictoryLine
          style={{
            data: { stroke: "#0000FF" },
            parent: { border: "1px solid #ccc" }
          }}
          data={ graphDataHighLow }/>
      </VictoryChart>
      </div>
      : false }
    </div>
  );
}



