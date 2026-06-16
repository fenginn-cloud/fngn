import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { About } from "@/components/About";
import { Expertise } from "@/components/Expertise";
import { Clients } from "@/components/Clients";
import { SelectedWorks } from "@/components/SelectedWorks";
import { Process } from "@/components/Process";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { portfolioSchema } from "@/lib/jsonld";

export default function Home() {
  return (
    <>
      <JsonLd data={portfolioSchema()} />
      <Navbar />
      <main id="main">
        <Hero />
        <Stats />
        <About />
        <Expertise />
        <Clients />
        <SelectedWorks />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
