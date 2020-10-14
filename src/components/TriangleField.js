import React from 'react';
import classes from './TriangleField.module.css'

const triangleField = (props) => {

    let triangleDirectionLeft = null;
    let triangleDirectionRight = null;
    if(props.Direction === "up") {
        if(props.Color === "Black")
        {
            triangleDirectionLeft = classes.triangleLeftUpBlack;
            triangleDirectionRight = classes.triangleRightUpBlack;
        } else {
            triangleDirectionLeft = classes.triangleLeftUpWhite;
            triangleDirectionRight = classes.triangleRightUpWhite;
        }
    
    } else if(props.Direction === "down") {    
        if(props.Color === "Black") {
            triangleDirectionLeft = classes.triangleLeftDownBlack;
            triangleDirectionRight = classes.triangleRightDownBlack;
        } else {
            triangleDirectionLeft = classes.triangleLeftDownWhite;
            triangleDirectionRight = classes.triangleRightDownWhite;
        }
    }

    return (
       /* <img src={triangle} alt="Triangle" class="triangle" />*/
       /*<div className={directionColor + " " + classes.TriangleField}></div>*/
       <div className={classes.TriangleField} /* onClick={() => props.pieceMoved(props.index)}*/>
           <div className={triangleDirectionLeft + " " + classes.trianglePart}></div>
           <div className={triangleDirectionRight + " " + classes.trianglePart}></div>
           {props.children}
       </div>
            
    );
}

export default triangleField;