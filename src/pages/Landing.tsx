import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import FloatingCards from "../components/landing/FloatingCards";
import HowItWorks from "../components/landing/HowItWorks";
import WhySafe from "../components/landing/WhySafe";
import CallToAction from "../components/landing/CallToAction";
import Footer from "../components/landing/Footer";
import "../components/landing/landing.css";

export default function Landing() {
  return (
    <div className="landing-page">
      <Navbar />
      <main>
        <Hero />
        <FloatingCards />
        <HowItWorks />
        <WhySafe />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
