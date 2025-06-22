import './Home.css'
import React from 'react'
import ContentEditor from '../ContentEditor/ContentEditor'
import FilesSidebar from '../FilesSidebar/FilesSidebar'
import PPTUpload from '../PPTUpload/PPTUpload'

const Home = () => {
  return (
    <>
      <FilesSidebar />
      <PPTUpload />
      {/* <ContentEditor /> */}
    </>
  )
}

export default Home
