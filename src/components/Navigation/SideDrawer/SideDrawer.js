import React from 'react'
import Logo from '../../Logo/Logo'
import NavigationItems from '../NavigationItems/NavigationItems'
import classes from './SideDrawer.css'
import BackDrop from '../../UI/Backdrop/Backdrop'
import Auxilary from '../../../hoc/Auxilary'


const sideDrawer = (props) => {

    let attachedClasses = [classes.SideDrawer, classes.Close]

    if(props.open) {
        attachedClasses=[classes.SideDrawer, classes.Open]
    }
    return (
        <Auxilary>
        <BackDrop show={props.open} clicked={props.closed}/>
        <div className={attachedClasses.join(' ')}>
            <Logo height="11%" margin="32px" />
            <nav>
                <NavigationItems />
            </nav>
        </div>
        </Auxilary>
    );
}

export default sideDrawer;