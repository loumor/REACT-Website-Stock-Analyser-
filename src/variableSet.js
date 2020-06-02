// Setters and Getters for variables on localstorage


let symbolSearch; // Hold the symbol clicked on the Stocks page 
let symbolSearchBool; // Hold the state if the users has clicked through the stocks page

function setSymbolSearch(value) { 
    symbolSearch = value; 
}

function setSymbolSearchBool(value) { 
    symbolSearchBool = value; 
}

function setlogInBool(value) { 
    localStorage.setItem('loginApproved', value);
}

function setloginToken(value) { 
    localStorage.setItem('tokenValue', value);
}

function setloginTokenType(value) { 
    localStorage.setItem('tokentypeValue', value);
}

function setUsername(value) { 
    localStorage.setItem('username', value);
}

export { symbolSearch, symbolSearchBool, setSymbolSearchBool, setSymbolSearch, setlogInBool, setloginToken, setloginTokenType, setUsername };

