import React from 'react'
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import SearchIcon from '@material-ui/icons/Search';
import PersonIcon from '@material-ui/icons/Person';
import LabelIcon from '@material-ui/icons/Label';
import '../App.css'

function TopNav() {
    return (
        <div className='Navbar'>
            <div className='leftSide'>
                <div className='Links'>
                    <a href='/search'><SearchIcon style={{fontSize: '16px'}}/> Search </a>
                    <a href='/tags'><LabelIcon style={{fontSize: '18px'}}/> Tags</a>
                </div>
            </div>
            <div className='center'>
                <div className='Links'>
                    <a href='/home'>Techflix <DesktopWindowsIcon style={{fontSize: '23px'}}/></a>
                </div>
            </div>
            <div className='rightSide'>
                <div className='Links'>
                    <a href='/person'><PersonIcon style={{fontSize: '20px'}}/> Marc Davis</a>
                </div>
            </div>
        </div>
    )
}

export default TopNav
