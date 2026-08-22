import Canvas3D from "../../components/3D/Canvas3D";
import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/hero";
import Features from "../../components/Features/Features";
import HowItWorks from "../../components/Howitworks/Howitworks";
import FAQ from "../../components/FAQ/FAQ";
import Footer from "../../components/Footer/Footer";

function Home() {
  return (
    <>
      <Canvas3D variant="hero" />
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <FAQ />
      <Footer />
    </>
  );
}

export default Home;