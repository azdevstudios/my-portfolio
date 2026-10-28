import { Link } from "react-router-dom";
import { ArrowUpRight, Code2, Layers } from "lucide-react";
import { FaReact, FaNodeJs } from "react-icons/fa";
import { SiNextdotjs, SiMongodb } from "react-icons/si";

import "../portfolio.css";

export default function Home() {
  return <div className="portfolio-page">
    <section className="pf-container pf-hero" aria-labelledby="home-heading">
      <div className="hero-copy">
        <p className="pf-eyebrow">ALI ZAIN · FULL-STACK DEVELOPER</p>
        <h1 id="home-heading" className="pf-heading pf-hero-title">Simple on the surface.<br/><span className="pf-accent">Thoughtful at every layer.</span></h1>
        <p className="pf-description">I turn ideas into considered digital experiences. Beautiful interfaces, dependable backends, and the details that bring it all together.</p>
        <div className="pf-actions"><Link to="/projects" className="pf-button">Explore my work <ArrowUpRight size={18}/></Link><Link to="/about" className="pf-text-link">Meet the developer <ArrowUpRight size={17}/></Link></div>
        <p className="pf-location">Based in Faisalabad, Pakistan · Building for the web.</p>
      </div>
      <div className="hero-stage" aria-label="Frontend and backend development toolkit">
        <div className="stage-halo" aria-hidden="true"/>
        <div className="identity-card"><div className="identity-top"><span className="identity-mark"><Code2 size={22}/></span><span>DESIGNED TO CONNECT</span><span className="status-dot"/></div><div className="identity-monogram">AZ<span>.</span></div><h2>Ali Zain</h2><p>Full-stack developer.<br/>Detail-oriented by design.</p><div className="identity-divider"/><div className="identity-stack">{[["React",FaReact],["Next.js",SiNextdotjs],["Node.js",FaNodeJs],["MongoDB",SiMongodb]].map(([name,Icon])=><span key={name}><Icon aria-hidden="true"/>{name}</span>)}</div></div>
        <div className="floating-note"><span className="note-icon"><Layers size={19}/></span><span>From interface<br/><strong>to infrastructure.</strong></span></div>
        <div className="stage-caption"><span/> Code with intention. Build with care.</div>
      </div>
    </section>
  </div>;
}
