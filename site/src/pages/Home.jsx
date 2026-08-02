import Hero from '../components/home/Hero';
import Territory from '../components/home/Territory';
import FishingTypes from '../components/home/FishingTypes';
import WhyHere from '../components/home/WhyHere';
import Rules from '../components/home/Rules';
import Team from '../components/home/Team';
import Actions from '../components/home/Actions';
import LatestNews from '../components/home/LatestNews';
import Contact from '../components/home/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <Territory />
      <FishingTypes />
      <WhyHere />
      <Rules />
      <Team />
      <Actions />
      <LatestNews />
      <Contact />
    </>
  );
}
