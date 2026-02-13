import Header from './components/Header'
import Hero from './components/Hero'
import Projects from './components/Projects'
import Resume from './components/Resume'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Projects />
        <Resume />
      </main>
      <Footer />
    </div>
  )
}

export default App
