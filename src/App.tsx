import { useState } from "react";
import Globe from "./Globe";
import { INDICATOR_SETS, INDICATOR_SET_NAMES, PLATFORMS, type Indicator, type IndicatorSet } from "./data";

const INK = "#e1502f";
const BONE = "#ede7dc";

function indicatorColor(indicator: Indicator) {
  return indicator.bad ? INK : BONE;
}

function sparklinePoints(series: number[]) {
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;
  return series.map((value, index) => {
    const x = (index / (series.length - 1)) * 118 + 1;
    const y = 28 - ((value - min) / span) * 26;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="UNEP GRID Geneva home">
        UNEP/GRID<br /><span>Geneva</span>
      </a>
      <nav aria-label="Primary navigation">
        <a href="#explore">Indicators</a>
        <a href="#platforms">Platforms</a>
        <a className="muted-link" href="#language">EN / FR</a>
      </nav>
    </header>
  );
}

function HeadlineIndicator({ indicator }: { indicator: Indicator }) {
  const color = indicatorColor(indicator);
  return (
    <article className="headline-indicator">
      <span className="headline-label">{indicator.label}</span>
      <span className="headline-value" style={{ color }}>
        {indicator.value}<span>{indicator.unit}</span>
      </span>
      <span className="headline-trend">
        <span style={{ color }}>{indicator.direction === "up" ? "↑" : "↓"}</span>
        {indicator.delta} · {indicator.range}
      </span>
    </article>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <p className="eyebrow">Global Resource Information Database · <span>Updated 07.08.2026</span></p>
      <h1>We care for our planet.</h1>
      <p className="side_pres">GRID-Geneva is a data and analytics centre established by the United Nations Environment Programme (UNEP) in 1985. With a team of 20 environment data scientists, we transform data into actionable information and knowledge to support decision-making on environmental and social issues. We operate cutting-edge open-source platforms, collaborate with a wide range of UN agencies, governments, and environmental conventions, and are fully embedded within UNEP's institutional and global partnership framework.</p>
      <div className="headline-grid">
        {INDICATOR_SETS.Climate.slice(0, 4).map((indicator) => (
          <HeadlineIndicator indicator={indicator} key={indicator.label} />
        ))}
      </div>
      <div className="scroll-cue"><span>↓</span>Three places where it shows</div>
    </section>
  );
}

const STORIES = [
  {
    beat: 1,
    location: "01 — Sahel",
    title: "Drylands under pressure",
    copy: "Land degradation is read from three decades of satellite records, cross-referenced with rainfall and population movement.",
    stats: [{ value: "18.4%", label: "Land degraded" }, { value: "+2.1M", label: "People exposed", alert: true }],
  },
  {
    beat: 2,
    location: "02 — European Alps",
    title: "A cryosphere in retreat",
    copy: "Glacier inventories held in Geneva track ice volume year by year — the closest thing Europe has to a thermometer you can walk on.",
    stats: [{ value: "−38%", label: "Ice volume, 2000–2025", alert: true }],
  },
  {
    beat: 3,
    location: "03 — Coral Triangle",
    title: "Reefs on the heat threshold",
    copy: "Sea-surface temperature anomalies are matched to reef extent to flag bleaching weeks before it becomes visible underwater.",
    stats: [{ value: "+1.8°C", label: "SST anomaly", alert: true }, { value: "61%", label: "Reefs at risk" }],
  },
];

function Stories() {
  return (
    <section className="stories" aria-label="Environmental stories">
      {STORIES.map((story, index) => (
        <article className={`story ${index === 1 ? "story-right" : ""}`} data-beat={story.beat} key={story.title}>
          <div className="story-content">
            <div className="story-location">{story.location}</div>
            <h2>{story.title}</h2>
            <p>{story.copy}</p>
            <div className="story-stats">
              {story.stats.map((stat) => (
                <div key={stat.label}>
                  <div className={stat.alert ? "alert" : ""}>{stat.value}</div>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}

function IndicatorRow({ indicator }: { indicator: Indicator }) {
  const color = indicatorColor(indicator);
  return (
    <article className="indicator-row">
      <div className="indicator-name">
        <span>{indicator.label}</span>
        <small>{indicator.source} · {indicator.range}</small>
      </div>
      <div className="indicator-value">
        <span style={{ color }}>{indicator.value}</span><small>{indicator.unit}</small>
      </div>
      <div className="indicator-chart">
        <span><b style={{ color }}>{indicator.direction === "up" ? "↑" : "↓"}</b> {indicator.delta}</span>
        <svg viewBox="0 0 120 30" preserveAspectRatio="none" role="img" aria-label={`${indicator.label} trend`}>
          <polyline points={sparklinePoints(indicator.series)} fill="none" stroke={color} strokeWidth="1.4" />
        </svg>
      </div>
    </article>
  );
}

function IndicatorExplorer() {
  const [activeSet, setActiveSet] = useState<IndicatorSet>("Climate");
  return (
    <section className="indicator-explorer" id="explore">
      <div className="content-width">
        <div className="section-heading">
          <h2>Explore all indicators</h2>
          <div className="tabs" role="tablist" aria-label="Indicator categories">
            {INDICATOR_SET_NAMES.map((name) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeSet === name}
                className={activeSet === name ? "active" : ""}
                onClick={() => setActiveSet(name)}
                key={name}
              >{name}</button>
            ))}
          </div>
        </div>
        <div className="indicator-list" role="tabpanel">
          {INDICATOR_SETS[activeSet].map((indicator) => <IndicatorRow indicator={indicator} key={indicator.label} />)}
        </div>
        <p className="methodology">Illustrative values · <a href="#methodology">Methodology and sources</a></p>
      </div>
    </section>
  );
}

function Platforms() {
  return (
    <section className="platforms" id="platforms">
      <div className="content-width">
        <h2>Platforms that put the data to work</h2>
        <div className="platform-grid">
          {PLATFORMS.map((platform, index) => (
            <a href="#platform-detail" className="platform-card" key={platform.name}>
              <small>{String(index + 1).padStart(2, "0")}</small>
              <strong>{platform.name}</strong>
              <span>{platform.description}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid content-width">
        <div className="footer-about">
          <strong>UNEP/GRID-Geneva</strong>
          <span>A partnership of UNEP, the University of Geneva and the Swiss Federal Office for the Environment.</span>
        </div>
        <div className="footer-links"><small>Data</small><a href="#explore">Indicators</a><a href="#datasets">Datasets</a><a href="#apis">APIs</a></div>
        <div className="footer-links"><small>Institute</small><a href="#about">About</a><a href="#projects">Projects</a><a href="#contact">Contact</a></div>
        <form className="newsletter" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="newsletter-email">Newsletter</label>
          <div><input id="newsletter-email" type="email" placeholder="you@org.int" /><button type="submit">Join</button></div>
        </form>
      </div>
      <p className="footer-note content-width">Concept mockup · basemap © MapLibre demo tiles · indicator values illustrative</p>
    </footer>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <Globe />
      <div className="grain" aria-hidden="true" />
      <Header />
      <main>
        <Hero />
        <Stories />
        <IndicatorExplorer />
        <Platforms />
      </main>
      <Footer />
    </div>
  );
}
