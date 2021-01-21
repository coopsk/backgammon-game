
import React from 'react'
import Aux from '../hoc/Auxx'
import classes from './Dice.module.css'

const RollDiceButton = (props) => {

    let labelText;
    if(props.disabled) {
        labelText = props.color + "'s turn";
    } else {
        labelText = "Roll Dice: " + props.color;
    }

    const dice = Object.keys( props.roll )
        .map( igKey => {
            
            if(igKey === props.diceActiveIndex)
                return <p style={{fontSize: '50px', display: 'inline', paddingRight: '15px'}} key={igKey}>{props.roll[igKey]}</p>
            else
                return <p style={{fontSize: '35px', display: 'inline', paddingRight: '15px', color: 'white'}} key={igKey}>{props.roll[igKey]}</p>
            
        } );

    return (
        <Aux>
        <button 
            className={classes.DiceButton} 
            onClick={props.onClick}
            disabled={props.disabled}>{labelText}</button>
        <div style={{margin: '5px'}}>
        {dice}
        </div>

        </Aux>
    )
};

export default RollDiceButton;