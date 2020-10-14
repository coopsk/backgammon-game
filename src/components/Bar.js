import React from 'react'
import classes from './Bar.module.css'

const bar = (props) => {

    return (
    <div className={classes.Bar}>
        {props.children}
    </div>)
}

export default bar;