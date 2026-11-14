import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import HowItWorks from "../components/landing/HowItWorks";
import WhySafe from "../components/landing/WhySafe";
import CallToAction from "../components/landing/CallToAction";
import Footer from "../components/landing/Footer";
import Reveal from "../components/landing/Reveal";
import "../components/landing/landing.css";

export default function Landing() {
  return (
    <div className="landing-page">
      <Navbar />
      <main>
        <Hero />
        <Reveal>
          <HowItWorks />
        </Reveal>
        <Reveal>
          <WhySafe />
        </Reveal>
        <Reveal>
          <CallToAction />
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}
