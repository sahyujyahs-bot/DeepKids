import './styles/global.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import SectionPlaceholder from './components/SectionPlaceholder'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <SectionPlaceholder id="s2" title="The Game" />
      <SectionPlaceholder id="s3" title="How To Play" />
      <SectionPlaceholder id="s4-science" title="Each Tile Carries Science" />
      <SectionPlaceholder id="s-spiral" title="Spirals In The Universe" />
      <SectionPlaceholder id="s-forces" title="Forces Against Gravity" />
      <SectionPlaceholder id="s-experience" title="Gravity Is Experienced" />
      <SectionPlaceholder id="s6" title="Game Features" />
      <SectionPlaceholder id="s7" title="Participate In Play Testing" />
      <Footer />
    </>
  )
}
