import React from 'react'
import Navbar from '../../components/navbar/navbar'
import { Card } from '@chakra-ui/react'
import Dashboard from '../../components/cards/cards'
const Home = () => {
  return (
    <>
    <Navbar/>
    <Dashboard/>
    </>
  )
}

export default Home