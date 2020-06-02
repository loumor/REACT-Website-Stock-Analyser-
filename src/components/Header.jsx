import React from "react";
import Nav from "./Nav";

// the header
export default function Header() {
  return (
    // Setup the thumbnail image for the website in the header 
    <header>
      <div id="icon">
        <img src="img/stockthumb.png" alt="Icon" width = "5%" height = "5%" />
      </div>
      <Nav />
    </header>
  );
}
