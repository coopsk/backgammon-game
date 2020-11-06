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

    let allClassesLeft = [triangleDirectionLeft, classes.trianglePart];
    let allClassesRight = [triangleDirectionRight, classes.trianglePart];
    let triangleClasses = props.isDestField ? [classes.TriangleField, classes.MoveSelected] : [classes.TriangleField];

    return (
<div className={triangleClasses.join(' ')} onClick={() => props.isDestField ? props.pieceMoved(props.index) : undefined }
            >
           <div className={allClassesLeft.join(' ')}></div>
           <div className={allClassesRight.join(' ')}></div>
           {props.children}
       </div>
            
    );
}

export default triangleField;