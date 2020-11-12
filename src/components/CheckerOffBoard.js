import React from 'react'
import classes from './CheckerOffBoard.module.css'
import Aux from '../hoc/Auxx';

const checkerOffBoard = (props) => {

    const allClasses = props.color === "White" ? classes.whiteChecker : classes.blackChecker;
    
    return (
        <Aux>
        <div class={allClasses} />
        {props.children}
        </Aux>
        )
    }
    
    export default checkerOffBoard;