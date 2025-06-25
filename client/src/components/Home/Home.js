import './Home.css'
import React from 'react'
import FilesSidebar from '../FilesSidebar/FilesSidebar'
import { Outlet } from 'react-router'

const Home = () => {
  return (
    <>
      <FilesSidebar />
      <Outlet />
    </>
  )
}

export default Home
