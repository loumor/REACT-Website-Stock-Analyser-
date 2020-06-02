import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main>
      <Hero /> 
      <Intro />
      <Features />
    </main>
  );
}

// Setup for the front page image 
const Hero = () => (
  <section className = "heroImage">
    <div className="hero__image"/>
  </section>
)

const Intro = () => (
  <section className="intro">
    <div className="intro__content">
      <h1 className="intro__title">The Wall Street Analyst</h1>
      <p className="intro__subtitle">Welcome to The Wall Street Analyst! This is a tool to observe and analyse stocks on the US exchange from November 2019 to March 2020. See below for more information.</p>
    </div>
  </section>
);

// Add each feature box 
function Features() {
  const featuresData = [
    {
      heading: "Stocks",
      text:
        "Search all the available companies.",
      img: { src: "img/nyse.jpg", alt: "Thumbs up icon" },
      link: "/stocks" 
    },
    {
      heading: "Quotes",
      text:
        "Get the latest price information by stock symbol.",
      img: { src: "img/quotes.jpg", alt: "Entertainment icon" },
      link: "/quotes"
    },
    {
      heading: "Price History",
      text:
        "Examine the most recent one hundred days of information for a particular stock.",
      img: { src: "img/pricehistory.png", alt: "Heart icon" },
      link: "/price_history"
    }
  ];

  return (
    <article className="features">
      <div className="features__header">
        <h2>Tools</h2>
      </div>

      <div className="features__box-wrapper">
        {
        featuresData.map(feature => (
          <FeatureBox feature={ feature } />
        ))}
      </div>
    </article>
  );
}

const FeatureBox = ({ feature }) => (
  <div className="features__box">
    <img src={ feature.img.src } alt={ feature.img.alt } />
    <li>
    <Link to ={ feature.link } style={ { textDecoration: 'none' } }>{ feature.heading }</Link> 
    </li>
    <p>{ feature.text }</p>
  </div>
);
