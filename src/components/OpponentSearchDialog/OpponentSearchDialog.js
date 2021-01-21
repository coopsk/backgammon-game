import React, { useState, useEffect} from 'react'
import Aux from '../../hoc/Auxx';
import Button from '../UI/Button/Button'

const OpponentSearchDialog = (props) => {
  
  const [state, setState] = useState({player2: ''});
  const [seconds, setSeconds] = useState(6);
  const [isActive, setIsActive] = useState(false);
  
  function startTimer() {
    setIsActive(true);
  }

  useEffect(() => {
    if(props.opponent != undefined) {
      setState({ player2: props.opponent});
        startTimer();
    }
  }, props.opponent);
 
  useEffect(() => {
    let interval = null;
    if (isActive) {
        interval = setInterval(() => {
        if (seconds < 1) {
          setIsActive(false);
          clearInterval(interval);
          props.clicked();
        } else {
          setSeconds(seconds => seconds - 1);
        }
      }, 1000);
     
    } else if (seconds < 1) {
      clearInterval(interval);
      setIsActive(false);
      props.clicked();
    }
   
    return () => clearInterval(interval);
  }, [isActive, seconds, props]);

  function onBackClicked() {
    console.log("onBackClicked");
    setIsActive(false);
    //clearInterval(intervalId);
    props.cancel();
  }

  const playerDivStyle = {
    display: "flex",
    minHeight: "50px",
    justifyContent: "space-between"
  }

  const style = {
    border: "2px solid darkgray",
    borderRadius: "5px",
    minWidth: "100px",
    margin: "0px 10px",
    padding: "0px 20px",
    lineHeight: "100px",
    verticalAlign: "middle",
    textAlign: "center"
    
  };

  const vsStyle = {
    lineHeight: "100px",
    fontSize: "xxx-large"
  }

  const countDownStyle = {
    lineHeight: "100px",
    fontWeight: "bold",
    fontSize: "xxx-large"
  }

  const btnStyle = {
    border: "2px solid darkgray",
    borderRadius: "5px"
  };

  return (
    <Aux>
      <h3>Waiting for player to join</h3>
      <div style={playerDivStyle}>
        <div style={style}>{props.player1}</div>
        {seconds !== 6 ? <div style={countDownStyle}>{seconds}</div> :  <div style={vsStyle}>VS</div> }
        <div style={style}>{state.player2 === '' ? '...' : state.player2}</div>
      </div>
      <Button style={btnStyle} buttonType="Continue" clicked={props.cancel}>Back</Button>     
      
    </Aux>
    );
  };
    
    export default OpponentSearchDialog;