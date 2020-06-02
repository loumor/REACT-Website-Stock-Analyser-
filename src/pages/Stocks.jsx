import React from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { useState, useEffect } from "react";
import { Button, Badge } from "reactstrap"; 
import { Link } from "react-router-dom";
import { setSymbolSearch, setSymbolSearchBool } from "../variableSet.js";

let industryChoices = ["All"]; // An array to hold all the industries. Start with 'All' as a replacement for the " " 

export default function Stocks() {
  return (
    <main> 
      <IndustryOptions /> 
      <StockTable />
    </main>
  ) 
}

function handleErrors(response) {
  if (!response.ok) {
      throw Error(response.statusText);
  }
  return response;
}

function Banner(props) {
  // Check if data has been collected from the server 
  if (props.rowData.length === 0) {
    return (
      <p className = "tableDescription"> <Badge color = "danger">{ props.rowData.length }</Badge> Stocks on the Database | <Badge color = "warning"> CHECK CONNECTION TO SERVER </Badge></p>
      );
  } else {
    return (
    <p className = "tableDescription"> <Badge color = "success">{ props.rowData.length }</Badge> Stocks on the Database: { props.industryName }</p>
    );
  }
}

// Run this function first to gather all the options for industries 
function IndustryOptions() {
  const [rowData, setRowData] = useState([]); 

  useEffect(() => {
    fetch(`http://131.181.190.87:3000/stocks/symbols/`)
    .then(handleErrors) 
    .then(res => res.json())
    .then(data => 
      data.map(stocks => {
        return {
          industry: stocks.industry,  
        };
      })
    )
    .then(stocks => setRowData(stocks)); 
  }, []);

  // Push all the available industries onto the global array 
  for (let i = 0; i < rowData.length; i++) {
    industryChoices.push(rowData[i].industry);
  }

  // Grab the industries only once 
  let unique = [...new Set(industryChoices)]; 

  // Update the global array with the final available industries
  industryChoices = unique;
  return true;
}

function StockTable() {
  const [industrySelection, setIndustry] = useState(""); // User choice of industry 
  const [rowData, setRowData] = useState([]); // Data from the API search 
  const [stockRowSelected, setStockRow] = useState(""); // User choice of row selected from table
  const [industryName, setIndustryName] = useState("All"); // Holds the user selected industry Name 
  const [buttonsActive, setButtonsActive] = useState(true); // Enables/Disables page buttons

  // Organise the table to display the results 
  const columns = [
    { headerName: "Stock", field: "name", filter: 'agTextColumnFilter', filterParams: {resetButton: true, applyButton: true}}, 
    { headerName: "Symbol", field: "symbol", filter: 'agTextColumnFilter', filterParams: {resetButton: true, applyButton: true}}, 
    { headerName: "Industry ", field: "industry"}
  ];

  useEffect(() => {
    fetch(`http://131.181.190.87:3000/stocks/symbols${industrySelection}`)
    .then(res => res.json())
    .then(data => 
      data.map(stocks => {
        return {
          name: stocks.name,
          symbol: stocks.symbol,
          industry: stocks.industry,
        };
      })
    )
    .then(stocks => setRowData(stocks)); 
  }, [industrySelection]);
  
  // Variable to pass to 'Banner' 
  let props = {
    rowData: rowData,
    industryName: industryName 
  };

  // Set the bool to true once the search button on the bottom of the page has been click
  function setSearched() {
    setSymbolSearchBool(true);
  }

  return (
    <div className = "container">
      <h1 className = "tableTitle">Available Stocks</h1>
      <Banner { ...props }/> 
    <div className = "userFunctions_wrapper">
      <div className = "userSelect">
        {// Map all the possible industry choices to a set of radio buttons so the user can pick which industry 
          industryChoices.map(feature => (
                <ul className = "radioList">
                  <input type="radio" name="radioButton" value = { feature }  
                    onChange={ event => {
                      // Find which industry the user has selected 
                      const { value } = event.target;
                      // Add the extra string values for the API search 
                      let finalValue = value.replace(/\s/g, '%20');
                      finalValue = "?industry=" + finalValue;
                    
                      if (value === "All") {
                        setIndustry(" "); // 'All' isnt a search on the API so it has to be replaced with " "
                        setIndustryName(value); 
                      } else {
                        setIndustry(finalValue);  
                        setIndustryName(value);
                      }
                    }}
                  />
                  <label className = "radioLabel">{ feature }</label>
                </ul>
        ))}
      </div>
    
      <div // Set up the Table 
      className="ag-theme-balham">
        <AgGridReact className = "tableStocks"
        columnDefs={ columns } 
        rowData={ rowData }
        pagination = { true }
        paginationPageSize={ 50 }
        rowSelection = 'single'
        onSelectionChanged = { event => {
          // Grab the row the user has clicked from the table 
          let selectedRow = event.api.getSelectedRows();
          let selectedRowSymbol = selectedRow.map(a => a.symbol);
          setStockRow(selectedRowSymbol); // Update the users selected row 
          setButtonsActive(false); // Activate the buttons now that the user has made a choice 
          setSymbolSearch(selectedRowSymbol); // Set the search symbol for Quotes or Price History page
        }}
        />
        </div>
          <div className = 'buttonsBottom'>
          <div className = "firstButton">

          <Link to = "/quotes">
          <Button
            color = "info"
            size = "sm"
            className = "mt-3"
            disabled = { buttonsActive } 
            onClick = { setSearched } 
            >
              Get a Quote for <b>{ stockRowSelected }</b>
          </Button>
          </Link> 

          </div>
          <div className = "secondButton">

          <Link to = "/price_history">
          <Button
            color = "info"
            size = "sm"
            className = "mt-3"
            onClick = { setSearched } 
            disabled = { buttonsActive } 
            >
              Get Price History for <b>{ stockRowSelected }</b>
          </Button>
          </Link>
          </div>
        </div> 
      </div>
    </div>
  );
}
