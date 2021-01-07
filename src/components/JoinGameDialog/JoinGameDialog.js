import React, { useState } from 'react'
import Aux from '../../hoc/Auxx';
import Button from '../UI/Button/Button'
import TextField from '@material-ui/core/TextField';

const JoinGameDialog = (props) => {
    
  const [state, setState] = useState({name: ''});

  const onTextChange = e => {
    setState({ ...state, [e.target.name]: e.target.value })
  }
  const onMessageSubmit = e => {
    e.preventDefault();
    const {name} = state;
    props.clicked(name);
    console.log("JoinGameDialog.js onMessageSubmit: " + name);
  }

  const style = {
    border: "2px solid darkgray",
    borderRadius: "5px"
  };

  const textFieldStyle = {
    paddingTop: "10px"
  };

  return (
      <Aux>
        <form onSubmit={onMessageSubmit}>
          <TextField name="name"
              value={state.name}
              onChange={e => onTextChange(e)}
              label="Name" />
          <Button style={style} buttonType="Continue">Join Game</Button>
      </form>
      </Aux>
      );
  };
    
    export default JoinGameDialog;