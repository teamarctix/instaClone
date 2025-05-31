import React from 'react'
import LeftSidebar from './LeftSidebar'
import Home from './Home'
import Profile from './Profile'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div>
         <LeftSidebar/>
        <div>
            <Outlet/>
        </div>
    </div>
  )
}

export default MainLayout