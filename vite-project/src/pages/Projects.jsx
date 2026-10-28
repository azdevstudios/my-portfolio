import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { ProjectGrid } from "../components/SelectedWork";
import ScrollReveal from "../components/ScrollReveal";
import "../portfolio.css";
export default function Projects() {
  return <div className="portfolio-page page-work"><div className="pf-container">
    <ScrollReveal><section className="pf-about-header"><p className="pf-eyebrow">SELECTED WORK</p><h1 className="pf-heading pf-about-title">Ideas, brought<br/><span className="pf-accent">to life.</span></h1><p className="pf-description">A closer look at the things I build. Real projects, considered interfaces, and the thinking behind them.</p></section></ScrollReveal>
    <section className="work-collection" aria-label="Project collection"><ProjectGrid detailed/></section>
    <ScrollReveal><section className="pf-about-cta"><div><p className="pf-eyebrow">WHAT COMES NEXT</p><h2 className="pf-heading">Your idea.<br/>Our next conversation.</h2></div><Link to="/contact" className="pf-button">Let’s build something <ArrowUpRight size={18}/></Link></section></ScrollReveal>
  </div></div>;
}
