import React from 'react';
import classes from './Pawn.module.css';

const pawn = (props) => {

    let colorStyle = {
        backgroundColor: "white"
    }

    if(props.Color === "Black") {
        colorStyle.backgroundColor = "black";
        //colorStyle.borderColor = "#464242";
    }

    let allClassNames = props.canMove ? [classes.Pawn, classes.Canmove] : [classes.Pawn];
    //let allClassNames = classes.Pawn + " " + classes.CanMove;//props.canMove ? classes.Pawn + " .canmove" : classes.Pawn;
    return (
        <div className={allClassNames.join(' ')} style={colorStyle} onClick={() => props.canMove ? props.pieceMoved(props.index) : undefined }/>
    );

}

export default pawn;