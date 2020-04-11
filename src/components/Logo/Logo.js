import React from 'react'
import burgerLogo from '../../assets/images/original.png'
import classes from './Logo.css'

const logo = (props) => (
    <div className={classes.Logo} style={{height:props.height, marginBottom: props.margin}} >
        <img src={burgerLogo} alt="My Burger" />
    </div>

)

export default logo