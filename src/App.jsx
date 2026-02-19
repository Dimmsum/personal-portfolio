import Header from "./components/Header";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Resume from "./components/Resume";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

const gridPattern = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20h40M20 0v40' stroke='%230f172a' stroke-width='0.35' fill='none'/%3E%3C/svg%3E")`;

function App() {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Grid + subtle gradient overlay for depth */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden="true"
        style={{ backgroundImage: gridPattern, opacity: 0.06 }}
      />
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-transparent via-transparent to-navy-50/30"
        aria-hidden="true"
      />
      <Header />
      <main className="flex-1 relative z-10">
        <Hero />
        <Projects />
        <Resume />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
