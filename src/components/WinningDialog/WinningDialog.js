import React from 'react'
import Aux from '../../hoc/Auxx';
import Button from '../UI/Button/Button'

const winningDialog = (props) => {
    
    const playerWonStr = "Player " + props.winner + " won!";
    return (
        <Aux>
        <h3>Game over</h3>
        <p>{playerWonStr}</p>
        <Button buttonType="Continue" clicked={props.clicked}>Done</Button>
        </Aux>
        );
    };
    
    export default winningDialog;