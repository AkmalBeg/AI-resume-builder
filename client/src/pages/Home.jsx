import React from 'react'
import Banner from '../Components/home/Banner'
import Hero from '../Components/home/Hero'
import Feature from '../Components/home/Feature'
import Testimonial from '../Components/home/Testimonial'
import CalltoAction from '../Components/home/CalltoAction'
import Footer from '../Components/home/Footer'
const Home = () => {
  return (
    <div>
        <Banner />
        <Hero />
        <Feature />
        <Testimonial />
        <CalltoAction />
        <Footer />
    </div>
  )
}

export default Home