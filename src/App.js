import React, { Component } from 'react';
import './App.css';
import Board from './components/Board';
import Layout from './Layout/Layout';
import Aux from "./hoc/Auxx"
import Modal from "./components/UI/Modal/Modal"
import WinningDialog from "./components/WinningDialog/WinningDialog"
import Button from './components/UI/Button/Button'
import io from 'socket.io-client';
import OpponentSearchDialog from './components/OpponentSearchDialog/OpponentSearchDialog';
import JoinGameDialog from './components/JoinGameDialog/JoinGameDialog';
import Pawn from './components/Pawn';

const WHITE_HOME_INDEX = -1;
const BLACK_HOME_INDEX = 24;
const WHITE_PLAYER = 1;
const BLACK_PLAYER = 2;
const WHITE_FIRST_HOME_FIELD_INDEX = 18; // The 19th field is the first home field
const BLACK_FIRST_HOME_FIELD_INDEX = 5; // The 5th field is the first home field

class App extends Component {

  
  state = {
    positions: Array(24).fill({ player: 0, pawns: 0 }),
    newGame: false,
    currentPlayer: 1,
    dice: [],
    newDiceIndex: 0,
    remainingMoves: {},
    bar: Array(2).fill( {pawns: 0 }),
    movingCheckerIndex: false,
    winningPlayer: false,
    ID: false,
    myPlayer: 1, // 1 for white, 2 for black
    myName: undefined,
    showJoinGameDialog: true,
    showOpponentSearchDlg: false,
    opponentPlayer: undefined
  };

  constructor() {
    super();
    
  }

  componentDidMount() {
    this.configureSocket();
  }
  
  componentWillUnmount() {
    this.socket.close();
  }

  configureSocket = () => {
    
    this.socket = io({secure: true});

    this.socket.on('your id', idObj => {
      this.setState({
        ID: idObj.socketId,
        myPlayer: idObj.playerIdent,
        myName: idObj.name
      });
    });

    this.socket.on('pieceselected', (index) => {
      console.log("client pieceselected: " + index);
      this.onPieceSelected(index);
    });

    this.socket.on('updateBoard', (msg) => {
      console.log("App.js: updateBoard received from server");
      this.setState({
        positions: msg.positions,
        bar: msg.bar,
        dice: msg.dice,
        newDiceIndex: msg.newDiceIndex
        });
    });
   
    this.socket.on('player', (player) => {
      console.log("client recieved message about changing player from: " + this.state.currentPlayer + " to: " + player + "; NewGame: " + this.state.newGame);
      this.setState({ 
        currentPlayer: player
       });
    });
    this.socket.on('connect', () => {
      console.log("connect on client side: " + this.socket.id);
    });
    this.socket.on('playerJoinGame', (name) => {
      if(name !== this.state.myName) {
        console.log("playerJoinGame on client side: opponent: " + name);
        this.setState({ opponentPlayer: name});
      }
    });
    this.socket.on('gameOver', (playerNbr, playerName) => {
      console.log("gameOver on client side: " + playerNbr + ", name: " + playerName + ", myName: " + this.state.myName);

      this.setState({
        showWinnerDialog: playerName
      }, () => {
        this.socket.disconnect(true);
        this.socket.open();
      });
    });
    this.socket.on('disconnected', (name) => {
      console.log("disconnected on client side: " + name + ", myName: " + this.state.myName);
      // show disconnecting dialog
      this.onGameCancelled();
    });
  };

  checkHasPiecesOnBar = (player) => {
    if(player !== undefined && player-1 < this.state.bar.length) {
      return this.state.bar[player-1].pawns > 0;
    } else {
      const sum = Object.keys(this.state.bar)
        .map(key => {
          return this.state.bar[key].pawns; 
        })
        .reduce((sum, el) => {
          return sum + el;
        }, 0);
        return sum; 
    }
  }

  initializeState = (callback) => {
    
    this.setState({
      positions: Array(24).fill({ player: 0, pawns: 0 }),
      newGame: false,
      currentPlayer: 1,
      dice: [],
      newDiceIndex: 0,
      remainingMoves: {},
      bar: Array(2).fill( {pawns: 0 }),
      movingCheckerIndex: false,
      winningPlayer: false,
      ID: false,
      myPlayer: 0,
      myName: undefined,
      showJoinGameDialog: true,
      showOpponentSearchDlg: false,
      opponentPlayer: undefined,
      whiteIsBearingOff: false,
      blackIsBearingOff: false
    }, () => {
      if(callback !== undefined) {
        callback();
      }
    });
  }

  onStartNewGame = () => {
    // clear the board
    this.initializeState();
  }

  startNewGameHandler = () => {
    this.initializeBoard();
  }

  initializeBoard = () => {
    
    let points = Array(24).fill({player: 0, pawns: 0});
    console.log("initializeBoard");
    points[0] = { player: 1, pawns: 2 };
    points[5] = { player: 2, pawns: 5 };
    points[7] = { player: 2, pawns: 3 };
    points[11] = { player: 1, pawns: 5 };
    points[12] = { player: 2, pawns: 5 };
    points[16] = { player: 1, pawns: 3 };
    points[18] = { player: 1, pawns: 5 };
    points[23] = { player: 2, pawns: 2 };
   
    this.setState({
      
      positions: points,
      newGame: true,
      currentPlayer: 1,
      dice: [],
      remainingMoves: {},
      bar: Array(2).fill( {pawns: 0 }),
      whiteIsBearingOff: false,
      blackIsBearingOff: false,
      showOpponentSearchDlg: false
   });
  } 

  onThrowDice = (...args) => {
    let dice = [];
    let dice1 = args.length >= 2 ? args[0] : Math.ceil(Math.random()*6);
    let dice2 = args.length >= 2 ? args[1] : Math.ceil(Math.random()*6);
    dice.push(dice1);
    dice.push(dice2);
    // Add double moves if the numbers are the same
    if(dice1 === dice2) {
      dice.push(dice1);
      dice.push(dice1);
    }
    this.setState({
      dice: dice
    }, () => {
       this.executeMoves(args.length === 3 ? args[2] : null);
     });
  }

  executeMoves = (calculateMoveFinished) => {

    if(this.state.dice.length > 0)
    {
      let bearingOff = this.checkPlayerIsBearingOff(this.state.currentPlayer);
      this.setState((state, props) => ({
        whiteIsBearingOff: bearingOff.whiteIsBearingOff,
        blackIsBearingOff: bearingOff.blackIsBearingOff
      }), () => {

        // Check if there are any possible moves with currentMove for currentPlayer
        const remainingMoves = this.getPossibleMoves();
        this.setState({
          remainingMoves: remainingMoves
        }, () => {
          if(Object.keys(this.state.remainingMoves).length === 0) {
        
            console.log("no more moves available: switch the player");
            let nextPlayer = (this.state.currentPlayer===1 ? 2: 1);
            this.socket.emit('player', nextPlayer);
            this.setState(({
              currentPlayer: nextPlayer,
              remainingMoves: []
            }), () => {
              if(calculateMoveFinished) {
                calculateMoveFinished();
              }
            });
          }
          if(calculateMoveFinished) {
            calculateMoveFinished();
          }
        });
      });
    }
  }

  // called from the server to update the state from other clients
  onPieceSelected = (index) => {
    this.setState({movingCheckerIndex: index});
  }

  onPieceSelectedHandler  = (index) => {
    this.socket.emit('pieceselected', index);
    if(this.state.movingCheckerIndex === false) {
      this.setState({
        movingCheckerIndex: index
      });
    } else {
      this.setState({
        movingCheckerIndex: false
      });
    }
  }

  // This is called if a pawn was clicked (through Pawn.js). Now the available target moves will be highlighted.
  onPieceMovedToHandler = (destinationIndex, onMoveFinishedHandler) => {
    
    destinationIndex = destinationIndex - 1;

    let usedDiceToMove = Math.abs(destinationIndex - this.state.movingCheckerIndex);
    let index = this.state.movingCheckerIndex;
      
    if(this.state.movingCheckerIndex !== false) {
     
      let playerDidMakeMove = false;
      // Check if the current player clicked on pawn AND if there are moves available
      let currentPlayer = this.state.currentPlayer;
      let copiedBoard = this.state.positions.map((point) => {
        return { player: point.player, pawns: point.pawns };
      });

      let copiedBar = this.state.bar.map((item) => {
        return { pawns: item.pawns };
      });

      index = parseInt(index, 10);
      let actualIndex = index;
      let pieceOnBar = index === -1 || index === 24;

      // player is on the bar
      if(pieceOnBar === false /*index !== -1*/ ) {
        actualIndex = index;
      }

      
      if( pieceOnBar === true || (actualIndex >= 0 && actualIndex < 24 && this.state.positions[actualIndex].pawns)) {
        let color;
        if(pieceOnBar === false) {
          color = this.state.positions[actualIndex].player === 1 ? "White" : "Black";
        }
        if((currentPlayer === 1 && color === "White") || (currentPlayer === 2 && color === "Black") || pieceOnBar === true) {
          console.log("Current Player clicked to move: " + color);
          // Convert the board positions from string to numbers
          const boardIndexKeys = Object.keys(this.state.remainingMoves).map((item) => { return Number(item);});

          let move = boardIndexKeys.find(x => x === actualIndex);
          if(move !== false) {
            playerDidMakeMove = true;
           
           // let destIndex = currentPlayer === 1 ? actualIndex + move.diceNbr : actualIndex - move.diceNbr;
            if(pieceOnBar === false)
              copiedBoard[actualIndex].pawns = copiedBoard[actualIndex].pawns - 1;
            else {
              copiedBar[currentPlayer-1].pawns--;
            }
            if(pieceOnBar === false && copiedBoard[actualIndex].pawns === 0)
              copiedBoard[actualIndex].player = 0;

            // Check if the piece is bearing off. If yes, don't try getting destination field
            if(destinationIndex < 24) {
              // Check if a piece was hit
              let destField = copiedBoard[destinationIndex];
              if(destField != undefined) {
                if(destField.pawns === 1 && destField.player !== currentPlayer) {
                  // Piece was hit
                  copiedBar[destField.player-1].pawns++;
                  destField.pawns = 1;
                  destField.player = currentPlayer;
                  
                } else {
                  destField.pawns = copiedBoard[destinationIndex].pawns + 1;
                  if(copiedBoard[destinationIndex].pawns > 0) {
                    console.log("update the current player");
                    copiedBoard[destinationIndex].player = currentPlayer;
                  }
                }
              }
            }

            this.setState({
              positions: copiedBoard,
              bar: copiedBar
            }, () => {
              if(playerDidMakeMove === true) {
                const newDice = [...this.state.dice];
                // Remove the dice that was used:
                const diceIndex = newDice.indexOf(usedDiceToMove);
                if(diceIndex != -1) {
                  newDice.splice(diceIndex, 1);
                } else if(newDice.length > 0) {
                  // The exact dice couldn't be found. Find closest match if bearing off 
                  // F.e. white's farthest pawn is on 21, needs a 4 to bear off, but dice are 5 and 6: use the 5 for that move.
                  console.assert(this.state.whiteIsBearingOff || this.state.blackIsBearingOff, "White or black must be bearing off: couldn't find exact match");
                  newDice.sort((a,b) => a-b);
                  console.log("New dice: " + newDice);
                  let dice = newDice[0];
                  for(let i=1; i<newDice.length; i++) {
                    if(dice < usedDiceToMove) {
                      dice = newDice[i];
                    } else {
                      break;
                    }
                  }
                  // now remove the dice that was just big enough to bear off the pawn
                  newDice.splice(newDice.indexOf(dice), 1);
                }
                let winner = this.checkPlayerWon(currentPlayer);
                if(winner === false) {
                  this.setState((prevState, props) => ({
                    dice: newDice
                  }), () => {

                    // updated the state of the dice. 
                    // Now let the server know to broadcast the change to the other player
                    this.socket.emit('updateBoard', this.state);

                    if(this.state.dice.length === 0) {
                      console.log("no more moves available: switch the player");
                      let nextPlayer = (this.state.currentPlayer===1 ? 2: 1);
                      this.socket.emit('player', nextPlayer);

                      this.setState((state, props) => ({
                        currentPlayer: nextPlayer,
                        remainingMoves: {} 
                      }));
                    } else {
                      console.log("After the move: update the remainingMoves to exclude the one I just did");
                      this.setState({
                        movingCheckerIndex: false
                      }, () => {
                        console.log("after resetting movingcheckerIndex to false, calculate new possible moves");
                        this.executeMoves(onMoveFinishedHandler);
                      });
                    }
                  });
                } else {
                  this.socket.emit('gameOver', winner, this.state.myName);
                  this.socket.emit('updateBoard', this.state);
                  this.setState({
                   
                    showWinnerDialog: this.state.myName
                  }, () => {
                    // just for testing conditions after a player won:
                    if(onMoveFinishedHandler !== undefined)
                      onMoveFinishedHandler();
                  });
                }
              }
            });
          }
        }
      }
    }
}

  getPossibleMoves = () => {
    let possibleMoves = {};
   
    const info = {
      whiteMoves: this.state.currentPlayer === 1,
      lastFieldNumber: this.state.currentPlayer === 2 ? 24 : -1
    }
    
    const numberOfDice = this.state.dice.length;
    for(let diceIndex = 0; diceIndex < numberOfDice; diceIndex++) {
      // First check for bar
      if(this.state.bar[this.state.currentPlayer-1].pawns > 0) {
        // Has to move with that piece
        let index = info.lastFieldNumber;//whiteMoves ? -1 : 24;
        
        const diceNbr = diceIndex < this.state.dice.length ? this.state.dice[diceIndex] : undefined;
        const destIndex = info.whiteMoves ? index + diceNbr : index - diceNbr;
        console.log("destIndex: " + destIndex);
        const destField = this.state.positions[destIndex];
        if(destIndex >= 0 &&  destIndex < 24) {
          // check if opponent was hit
          if(destField.pawns === 1 && destField.player !== this.state.currentPlayer) {
            console.log("HIT OPPONENT PIECE: " + destIndex);
            this.addPossibleMove(possibleMoves, index, diceNbr);
            
          } else if(destField.pawns > 1 && destField.player !== this.state.currentPlayer) {
            // check if opponent has two or more pieces on it
            console.log("FIELD ALREADY OCCUPIED BY OPPONENT: " + destIndex);
          } else {
            // Regular move from bar to empty field
            this.addPossibleMove(possibleMoves, index, diceNbr);
          }
        }
      } else {

        // Now check for all other possible moves
        const diceNbr = diceIndex < this.state.dice.length ? this.state.dice[diceIndex] : undefined;
        for(let [index, currentField] of this.state.positions.entries()) {
          if(this.state.currentPlayer === currentField.player && currentField.pawns > 0) {
            const destIndex = info.whiteMoves ? index + diceNbr : index - diceNbr;
            const destField = this.state.positions[destIndex];

            if((info.whiteMoves && this.state.whiteIsBearingOff) || (!info.whiteMoves && this.state.blackIsBearingOff)) {
              if(destIndex === 24 || destIndex === -1) {
                this.addPossibleMove(possibleMoves, index, diceNbr);
              } else if(destIndex > 24 || destIndex < -1) {
                if(this.state.blackIsBearingOff) {
                  let canBearOff = true;
                  for(let i = index+1; i<= BLACK_FIRST_HOME_FIELD_INDEX; i++) {
                    if(this.state.positions[i].pawns > 0 && this.state.positions[i].player === BLACK_PLAYER) {
                      // Found a checker that is farther away: Only the farthest checker can bear off
                      canBearOff = false;
                      break;
                    }
                  }
                  if(canBearOff) {
                    this.addPossibleMove(possibleMoves, index, diceNbr);
                  }
                } else if(this.state.whiteIsBearingOff) {
                  let canBearOff = true;
                  for(let i = index-1; i >= WHITE_FIRST_HOME_FIELD_INDEX; i--) {
                    if(this.state.positions[i].pawns > 0 && this.state.positions[i].player === WHITE_PLAYER) {
                      // Found a checker that is farther away: Only the farthest checker can bear off
                      canBearOff = false;
                      break;
                    }
                  }
                  if(canBearOff) {
                    this.addPossibleMove(possibleMoves, index, diceNbr);
                  }
                }
              }
            }
            if(destIndex >= 0 &&  destIndex < 24) {
              // check if opponent was hit
              if(destField.pawns === 1 && destField.player !== this.state.currentPlayer) {
                console.log("HIT OPPONENT PIECE: " + destIndex);
                this.addPossibleMove(possibleMoves, index, diceNbr);
            
              } else if(destField.pawns > 1 && destField.player !== this.state.currentPlayer) {
                // check if opponent has two or more pieces on it
                console.log("FIELD ALREADY OCCUPIED BY OPPONENT: " + destIndex);
              } else {
                this.addPossibleMove(possibleMoves, index, diceNbr);
              }
            }
        }
      }
    }
   }
  return possibleMoves;
  }

  addPossibleMove = (possibleMoves, index, diceNbr) => {
    if(possibleMoves[index] !== undefined) {
      possibleMoves[index].push(diceNbr);
    } else {
      possibleMoves[index] = [];
      possibleMoves[index].push(diceNbr);
    }
    return possibleMoves;
  }

  /**
   * Check if each player is bearing off after each move
   */
  checkPlayerIsBearingOff = ( player ) => {

    let result = {};
    let copiedBoard = [...this.state.positions];
    let foundPlayer = false;

    // if white player, no white checkers should be outside of white's home (19-24) 
    if(player === WHITE_PLAYER) {
      for(let index = 0; index < WHITE_FIRST_HOME_FIELD_INDEX; index++) {
        if(copiedBoard[index].player === player) {
          foundPlayer = true;
          break;
        }
      }
    }
    // if black player, no black checkers should be outside of black's home (1-6) 
    else if(player === BLACK_PLAYER) {
      for(let index = BLACK_FIRST_HOME_FIELD_INDEX+1; index < 24; index++) {
        if(copiedBoard[index].player === player) {
          foundPlayer = true;
          break;
        }
      }
    }

    result.whiteIsBearingOff = (foundPlayer === false && player === WHITE_PLAYER ? true : false );
    result.blackIsBearingOff = (foundPlayer === false && player === BLACK_PLAYER ? true: false);
    return result;
  }

  checkPlayerWon = (player) => {
    
    for(let index = 0; index < this.state.positions.length; index++) {
      if(this.state.positions[index].player === player) {
        return false;
      }
    }
    this.setState({
      winningPlayer: player
    });
    return player;
  }

  gameOver = () => {
    console.log("game over");
    this.setState({
      showWinnerDialog: false
    });
  }

  onGameCancelled = () => {
    console.log("onGameCancelled");

    this.initializeState( () => {
      console.log("onGameCancelled now reconnect to server");

      this.socket.disconnect(true);
      this.socket.open();
    });
  }
  onJoinGame = (name) => {
    this.setState({
      myName: name,
      showOpponentSearchDlg: true,
      showJoinGameDialog: false
    }, () => {
      this.socket.emit('joinGame', name);
    });
  }

  onBoardClicked = () => {
    // unselect the target field if the user clicked anywhere on the board
    if(this.currentPlayer === this.myPlayer && this.state.movingCheckerIndex !== false) {
      this.setState({
        movingCheckerIndex: false
      });
    }
  }

  render() {
  
    let canRollDice = false;
    if(Object.keys(this.state.remainingMoves).length === 0 &&
      this.state.newGame &&
      this.state.currentPlayer === this.state.myPlayer) {
        canRollDice = true;
    }

    let pieceSelected = null;
    if(this.state.movingCheckerIndex === false) {
      pieceSelected = this.onPieceSelectedHandler;
    } else {
      pieceSelected = this.onPieceMovedToHandler;
    }

    let nbrOfWhiteCheckersOffBoard = 0;
    let nbrOfBlackCheckersOffBoard = 0;
    if(this.state.newGame) {
      let copiedBoard = [...this.state.positions];
  
      // count all pieces in white's home and check if all of them are there
      for(let index = 0; index < copiedBoard.length; index++) {
        if(copiedBoard[index].player === WHITE_PLAYER) {
          nbrOfWhiteCheckersOffBoard += copiedBoard[index].pawns;
        } else if(copiedBoard[index].player === BLACK_PLAYER) {
          nbrOfBlackCheckersOffBoard += copiedBoard[index].pawns;
        }
      }

      nbrOfBlackCheckersOffBoard = ((15 - this.state.bar[1].pawns) - nbrOfBlackCheckersOffBoard);
      nbrOfWhiteCheckersOffBoard = ((15 - this.state.bar[0].pawns) - nbrOfWhiteCheckersOffBoard);
    }

    let showModalDlg = this.state.showJoinGameDialog || this.state.showWinnerDialog || this.state.showOpponentSearchDlg;
    let modalDialog;
    if(this.state.showWinnerDialog) {
      modalDialog = <WinningDialog winner={this.state.showWinnerDialog} myPlayer={this.state.myPlayer} clicked={this.gameOver}/>
    } else if(this.state.showJoinGameDialog) {
      modalDialog = <JoinGameDialog clicked={this.onJoinGame} />
    } else if(this.state.showOpponentSearchDlg) {
      modalDialog = <OpponentSearchDialog ID={this.state.ID} player1={this.state.myName} opponent={this.state.opponentPlayer} server={this.socket} clicked={this.startNewGameHandler} cancel={this.onGameCancelled} />
      console.log("renderer() show OpponentSearchDialog");
    }
    
    let mycolor = this.state.myPlayer == 1 ? "White" : "Black";
    let opponentColor = this.state.myPlayer == 1 ? "Black" : "White";
    let currentPlayerCheckers = null;
    if(this.state.opponentPlayer !== undefined) {
      currentPlayerCheckers = 
      <div style={{display: 'inherit'}}>
      <div style={{display: 'flex'}}>
        <Pawn key={0} Color={mycolor} /> <p style={{marginLeft: '10px'}}>{this.state.myName}</p>
      </div>
      <div style={{display: 'flex', padding: '0px 40px'}}>
        <Pawn key={1} Color={opponentColor} /> <p style={{marginLeft: '10px'}}>{this.state.opponentPlayer}</p>
      </div>
      </div>
      ;
    }
    return (
      <Aux>
        <Modal show={showModalDlg} modalClosed={this.purchaseCancelHandler}>
          {modalDialog}  
        </Modal>
        <Layout>
            <div style={{display: 'flex', marginLeft: '20px'}}>
              <Button clicked={this.onStartNewGame} buttonType="Start">New Game</Button>
              {currentPlayerCheckers}
              
            </div>
          <Board 
            clicked={this.onBoardClicked}
            pawnPositions={this.state.positions} 
            throwDice={this.onThrowDice} 
            pieceMoved={pieceSelected}
            roll1={this.state.dice[0]}  
            roll2={this.state.dice[1]} 
            roll={this.state.dice}
            diceActiveIndex={this.state.newDiceIndex}
            disabled={!canRollDice}
            color={this.state.currentPlayer === 1 ? "White" : "Black"}
            bar={this.state.bar}
            possibleMoves={this.state.remainingMoves}
            movingCheckerIndex={this.state.movingCheckerIndex}
            checkersAtHome={{ 
              whiteCheckers: nbrOfWhiteCheckersOffBoard,
              blackCheckers: nbrOfBlackCheckersOffBoard
            }}
          />
          </Layout>
        </Aux>
        );
    }
}

export default App;
