import React from 'react';
import classes from './Pawn.module.css';

const pawn = (props) => {

    let colorStyle = {
        backgroundColor: "white"
    }

    if(props.Color === "Black") {
        colorStyle.backgroundColor = "black";
    }

    let allClassNames = props.canMove ? [classes.Pawn, classes.Canmove] : [classes.Pawn];
    return (
        <div className={allClassNames.join(' ')} style={colorStyle} onClick={() => props.canMove ? props.pieceMoved(props.index) : undefined }/>
    );

}

export default pawn;