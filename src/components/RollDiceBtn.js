
import React from 'react'
import Aux from '../hoc/Auxx'
import classes from './Dice.module.css'

const rollDiceButton = (props) => {

    let labelText;
    if(props.disabled) {
        labelText = props.color + "'s turn";
    } else {
        labelText = "Roll Dice: " + props.color;
    }

    let diceText = "";
    if(props.roll1 !== undefined)
        diceText = props.roll1;
    if(props.roll2 !== undefined)
       diceText = diceText + (props.roll1 !== undefined ? ", " : "") + props.roll2;
    if(props.roll1 !== undefined && props.roll1 === props.roll2) {
        diceText = props.roll1 + ", " + props.roll1 + ", " + props.roll1 + ", " + props.roll1;
    }

    const diceText2 = Object.keys( props.roll )
        .map( igKey => {
            //console.log("igKey: " + igKey + ", dice Index: " + props.diceActiveIndex);
            if(igKey === props.diceActiveIndex)
                return <p style={{fontSize: '50px', display: 'inline', paddingRight: '10px'}} key={igKey}>{props.roll[igKey]}</p>
            else
                return <p style={{fontSize: '35px', display: 'inline', paddingRight: '10px', color: 'gray'}} key={igKey}>{props.roll[igKey]}</p>
            
        } );

    return (
        <Aux>
        <button 
            className={classes.DiceButton} 
            onClick={props.onClick}
            disabled={props.disabled}>{labelText}</button>
        {diceText2}
        </Aux>
    )
}

export default rollDiceButton;