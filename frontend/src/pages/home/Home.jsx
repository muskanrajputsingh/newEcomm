import React from 'react'
import Carousel from '../../components/carousel/Carousel'
import Category from '../../components/category/Category'
import Featured from '../../components/featured/Featured'
import Trendy from '../../components/trendy/Trendy'
import Blog from '../../components/blog/Blog'
import Map from '../../components/map/Map'

const Home = () => {
  return (
    <>
    <Carousel />
    <Category />
    <Featured/>
    <Trendy/>
    <Blog/>
    <Map/>
    </>
  )
}

export default Home
