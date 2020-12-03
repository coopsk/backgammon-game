import React, { Component } from 'react';
import './App.css';
import Board from './components/Board';
import Layout from './Layout/Layout';
import _ from "lodash";
import Aux from "./hoc/Auxx"
import Modal from "./components/UI/Modal/Modal"
import WinningDialog from "./components/WinningDialog/WinningDialog"
import Button from './components/UI/Button/Button'

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
    winningPlayer: false
  }


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

  _test_NoMoreMoves = () => {
    
    let points = Array(24).fill({player: 0, pawns: 0});
    points[0] = { player: 1, pawns: 1 };
    points[2] = { player: 1, pawns: 9 };
    points[5] = { player: 2, pawns: 5 };
   
    points[7] = { player: 2, pawns: 3 };
    points[12] = { player: 2, pawns: 5 };
    points[19] = { player: 1, pawns: 5 };
    points[23] = { player: 2, pawns: 2 };
   
    this.setState({
      
      positions: points,
      newGame: true,
      currentPlayer: 1,
      dice: [],
      remainingMoves: [],
      bar: Array(2).fill( {pawns: 0 })
   }, () => {
    this.onThrowDice(5, 5, () => {
      console.log("_test_NoMoreMoves");
      console.assert(this.state.dice.length === 4, "Expected 4 dice, but " + this.state.dice.length + " found");
      console.assert(this.state.remainingMoves.length === 0, "Expected 0 remaining moves, but " + this.state.remainingMoves.length + " found");
    });
   });
  }

  // 
  _test_BlackOnBar = () => {
    
    let points = Array(24).fill({player: 0, pawns: 0});
    points[0] = { player: 1, pawns: 1 };
    points[5] = { player: 2, pawns: 4 };
    points[7] = { player: 2, pawns: 3 };
    points[11] = { player: 1, pawns: 5 };
    points[12] = { player: 2, pawns: 5 };
    points[16] = { player: 1, pawns: 3 };
    points[18] = { player: 1, pawns: 5 };
    points[23] = { player: 2, pawns: 2 };

    let bar = Array(2).fill( {pawns: 0 })
    bar[1] = {pawns: 1};

    this.setState({
      
      positions: points,
      newGame: true,
      currentPlayer: 2,
      dice: [],
      remainingMoves: [],
      bar
   }, () => {
    this.onThrowDice(5, 2, () => {
      console.log("_test_BlackOnBar");
      console.assert(this.state.dice.length === 2, "Expected 2 dice, but " + this.state.dice.length + " found");
      console.assert(this.state.remainingMoves.length === 0, "Expected 0 remaining moves, but " + this.state.remainingMoves.length + " found");
    });
   });
  }

  _test_WhiteOnBarCantMoveFirstDice = () => {
    
    let points = Array(24).fill({player: 0, pawns: 0});
    console.log("startNewGameHandler");
    points[0] = { player: 2, pawns: 1 };
    points[1] = { player: 2, pawns: 2 };
    points[3] = { player: 2, pawns: 1 };
    points[5] = { player: 2, pawns: 2 };
    points[7] = { player: 2, pawns: 1 };
    points[8] = { player: 2, pawns: 1 };
    points[11] = { player: 1, pawns: 4 };
    points[12] = { player: 2, pawns: 5 };
    points[15] = { player: 2, pawns: 2 };
    points[19] = { player: 1, pawns: 1 };
    points[21] = { player: 1, pawns: 1 };
    points[22] = { player: 1, pawns: 6 };
    points[23] = { player: 1, pawns: 1 };

    let bar = Array(2).fill( {pawns: 0 })
    bar[0] = {pawns: 1};

    this.setState({
      
      positions: points,
      newGame: true,
      currentPlayer: 1,
      dice: [],
      remainingMoves: [],
      bar
   }, () => {
    this.onThrowDice(2, 3);
   });
  }

  _test_BlackPutsWhiteOnBarWith3  = () => {
    
    
    let points = Array(24).fill({player: 0, pawns: 0});
    console.log("startNewGameHandler");
    points[0] = { player: 1, pawns: 1 };
    points[2] = { player: 1, pawns: 1 };
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
      currentPlayer: 2,
      dice: [],
      remainingMoves: [],
      bar: Array(2).fill( {pawns: 0 })
   }, () => {
    this.onThrowDice(3, 1);
   });
  } 

  _test_WhiteAtEnd = () => {
    
    let points = Array(24).fill({player: 0, pawns: 0});
    console.log("startNewGameHandler");
    points[0] = { player: 1, pawns: 2 };
    points[5] = { player: 2, pawns: 5 };
    points[7] = { player: 2, pawns: 3 };
    points[11] = { player: 1, pawns: 5 };
    points[12] = { player: 2, pawns: 5 };
    points[16] = { player: 1, pawns: 3 };
    points[18] = { player: 1, pawns: 5 };
    points[23] = { player: 2, pawns: 2 };
    
    
    let bar = Array(2).fill( {pawns: 0 })
   
    this.setState({
      
      positions: points,
      newGame: true,
      currentPlayer: 1,
      dice: [],
      remainingMoves: [],
      bar
    },  () => {
      console.log("testing bar after setState: " + this.state.bar[0].pawns);
      this.onThrowDice(6, 4);
    });
  }

  _test_WhiteOnBar = () => {
    
    let points = Array(24).fill({player: 0, pawns: 0});
    console.log("startNewGameHandler");
    points[0] = { player: 1, pawns: 1 };
    points[5] = { player: 2, pawns: 5 };
    points[7] = { player: 2, pawns: 3 };
    points[11] = { player: 1, pawns: 5 };
    points[12] = { player: 2, pawns: 5 };
    points[16] = { player: 1, pawns: 3 };
    points[18] = { player: 1, pawns: 5 };
    points[23] = { player: 2, pawns: 2 };
    
    
    let bar = Array(2).fill( {pawns: 0 })
    // fixme why does bar[0].pawns = 1; not work? 
    bar[0] = {pawns: 1};
    console.log("testing bar before setState: " + this.state.bar[0].pawns);

    this.setState({
      
      positions: points,
      newGame: true,
      currentPlayer: 1,
      dice: [],
      remainingMoves: [],
      bar
    },  () => {
      console.log("testing bar after setState: " + this.state.bar[0].pawns);
      this.onThrowDice(4, 4);
    });

  }

  // Test that moving the last pawn into white's home
  // should now mark white as being able to bear off.
  // The last move, a 1, could now be moved off the board.
  _test_checkWhiteIsBearingOff = () => {
    let points = Array(24).fill({player: 0, pawns: 0});
    points[14] = { player: 1, pawns: 1 };
    points[18] = { player: 1, pawns: 2 };
    points[19] = { player: 1, pawns: 1 };
    points[20] = { player: 1, pawns: 4 };
    points[21] = { player: 1, pawns: 2 };
    points[23] = { player: 1, pawns: 5 };
    
    // black pawns
    points[1] = { player: 2, pawns: 2 };
    points[2] = { player: 2, pawns: 3 };
    points[7] = { player: 2, pawns: 2 };
    points[8] = { player: 2, pawns: 4 };
    points[10] = { player: 2, pawns: 3 };
    points[17] = { player: 2, pawns: 1 };

    let bar = Array(2).fill( {pawns: 0 })

    this.setState({
      
      positions: points,
      newGame: true,
      currentPlayer: 1,
      dice: [],
      remainingMoves: [],
      bar,
      movingCheckerIndex: 14
    },  () => {
      //this.checkPlayerIsBearingOff(1);
      this.onThrowDice(4, 1, () => {
        //this.onPieceSelectedHandler()
        this.onPieceMovedToHandler(19);
      });
      console.log("_test_checkWhiteIsBearingOff");
     // console.assert(this.state.dice.length === 2, "Expected 2 dice, but " + this.state.dice.length + " found");
     // console.assert(this.state.remainingMoves.length === 0, "Expected 0 remaining moves, but " + this.state.remainingMoves.length + " found");
    });

  }

  // TODO: Anna can fill this out
  _test_checkBlackIsBearingOff = () => {
    let points = Array(24).fill({player: 0, pawns: 0});
    points[7] = { player: 1, pawns: 1 };
    points[12] = { player: 1, pawns: 2 };
    points[13] = { player: 1, pawns: 5 };
    points[15] = { player: 1, pawns: 2 };
    points[19] = { player: 1, pawns: 5 };
    
    points[5] = { player: 2, pawns: 5 };
    points[4] = { player: 2, pawns: 2 };
    points[3] = { player: 2, pawns: 1 };
    points[2] = { player: 2, pawns: 2 };
    points[1] = { player: 2, pawns: 3 };
    points[0] = { player: 2, pawns: 2 };
    
    
    let bar = Array(2).fill( {pawns: 0 })

    this.setState({
      
      positions: points,
      newGame: true,
      currentPlayer: 2,
      dice: [],
      remainingMoves: [],
      bar
    },  () => {
      this.checkPlayerIsBearingOff(2);
      this.onThrowDice(4, 1, () => {
        console.log("_test_checkBlackIsBearingOff");
        
      });
    });
  }

  _test_bearOffWhite = () => {
    let points = Array(24).fill({player: 0, pawns: 0});
    points[18] = { player: 1, pawns: 2 };
    points[19] = { player: 1, pawns: 2 };
    points[20] = { player: 1, pawns: 4 };
    points[21] = { player: 1, pawns: 2 };
    points[23] = { player: 1, pawns: 5 };
    
    // black pawns
    points[1] = { player: 2, pawns: 2 };
    points[2] = { player: 2, pawns: 3 };
    points[7] = { player: 2, pawns: 2 };
    points[8] = { player: 2, pawns: 4 };
    points[10] = { player: 2, pawns: 3 };
    points[17] = { player: 2, pawns: 1 };

    let bar = Array(2).fill( {pawns: 0 })

    this.setState({
      
      positions: points,
      newGame: true,
      currentPlayer: 1,
      dice: [],
      remainingMoves: [],
      bar
    },  () => {
      this.checkPlayerIsBearingOff(1);
      this.onThrowDice(5, 1, () => {
        console.log("_test_bearOffWhite");
        console.assert(this.state.dice.length === 2, "Expected 2 dice, but " + this.state.dice.length + " found");
        console.assert(this.state.remainingMoves.length === 2, "Expected 2 remaining moves, but " + this.state.remainingMoves.length + " found");
        console.assert(this.state.whiteIsBearingOff === true, "Expected whiteIsBearingOff to be true, but " + this.state.whiteIsBearingOff + " found");
      });
    });

  }

  _test_bearOffWhite2 = () => {
    let points = Array(24).fill({player: 0, pawns: 0});
    points[18] = { player: 1, pawns: 2 };
    points[19] = { player: 1, pawns: 2 };
    points[20] = { player: 1, pawns: 4 };
    points[21] = { player: 1, pawns: 2 };
    points[23] = { player: 1, pawns: 5 };
    
    // black pawns
    points[1] = { player: 2, pawns: 2 };
    points[2] = { player: 2, pawns: 3 };
    points[7] = { player: 2, pawns: 2 };
    points[8] = { player: 2, pawns: 4 };
    points[10] = { player: 2, pawns: 3 };
    points[17] = { player: 2, pawns: 1 };

    let bar = Array(2).fill( {pawns: 0 })

    this.setState({
      
      positions: points,
      newGame: true,
      currentPlayer: 1,
      dice: [],
      remainingMoves: [],
      bar
    },  () => {
      this.checkPlayerIsBearingOff(1);
      this.onThrowDice(6, 6, () => {
        console.log("_test_bearOffWhite2");
        console.assert(this.state.dice.length === 4, "Expected 4 dice, but " + this.state.dice.length + " found");
        console.assert(this.state.remainingMoves.length === 2, "Expected 2 remaining moves, but " + this.state.remainingMoves.length + " found");
        console.assert(this.state.whiteIsBearingOff === true, "Expected whiteIsBearingOff to be true, but " + this.state.whiteIsBearingOff + " found");
      });
    });

  }

  
  _test_black_wins = () => {
    let points = Array(24).fill({player: 0, pawns: 0});
    points[5] = { player: 2, pawns: 1 };
    
    points[19] = { player: 1, pawns: 1 };
    points[20] = { player: 1, pawns: 4 };
    points[21] = { player: 1, pawns: 2 };
    points[23] = { player: 1, pawns: 5 };

    let bar = Array(2).fill( {pawns: 0 })

    this.setState({
      
      positions: points,
      newGame: true,
      currentPlayer: 2,
      dice: [],
      remainingMoves: [],
      bar
    },  () => {
      this.checkPlayerIsBearingOff(2);
      this.onThrowDice(6, 2, () => {
       
      });
    });

  }


  startNewGameHandler = () => {
    
    let points = Array(24).fill({player: 0, pawns: 0});
    console.log("startNewGameHandler");
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
      remainingMoves: [],
      bar: Array(2).fill( {pawns: 0 }),
      whiteIsBearingOff: false,
      blackIsBearingOff: false
   });
  } 

  _test_bug = () => {
    
    
    let points = Array(24).fill({player: 0, pawns: 0});
    console.log("startNewGameHandler");
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
      currentPlayer: 2,
      dice: [],
      remainingMoves: [],
      bar: Array(2).fill( {pawns: 0 })
   }, () => {
    this.onThrowDice(4, 1);
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

    // k.c this.checkPlayerIsBearingOff(this.state.currentPlayer);

    //console.log("Throw dice for player: " + this.state.currentPlayer + ": " + dice1 + ", " + dice2);
    this.setState({
      dice: dice
    }, () => {
       //console.log("testing dice after setState: " + this.state.dice[0]);
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
          if(this.state.remainingMoves.length === 0) {
        
            console.log("no more moves available: switch the player");
            this.setState((state, props) => ({
              currentPlayer: (state.currentPlayer===1 ? 2: 1),
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

  onPieceSelectedHandler  = (index) => {

    if(this.state.movingCheckerIndex === false) {
      this.setState({
        movingCheckerIndex: index
      }, () => {
        // If the user selected the pawn to move, fill the array with the destination fields
        /*
        this.setState({
          destinationFields = fields
        });
        */
      });
    } else {
      this.setState({
        movingCheckerIndex: false
      }, () => {
        //this.setState({
        //  destinationFields = []
        //});
      });
    }

  }

  // This is called if a pawn was clicked (through Pawn.js). Now the available target moves will be highlighted.
  onPieceMovedToHandler = (destinationIndex) => {
    
    destinationIndex = destinationIndex - 1;

    let usedDiceToMove = Math.abs(destinationIndex - this.state.movingCheckerIndex);
    let index = this.state.movingCheckerIndex;
      
    if(this.state.movingCheckerIndex !== false) {
      this.setState({
        movingCheckerIndex: false
      });

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
              /*
              let max = [...this.state.bar];
              max[currentPlayer-1].pawns--;

              this.setState({
                bar: max
              })
              */
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
                } 
                //newDice.shift();
              //  this.setState({dice: newDice})
              // if(newDice.length == 0) {
    // k.c            this.checkPlayerIsBearingOff(currentPlayer);
                let winner = this.checkPlayerWon(currentPlayer);
                if(winner === false) {
                  this.setState((prevState, props) => ({
                    dice: newDice
                  }), () => {
                    if(this.state.dice.length === 0) {
                      console.log("no more moves available: switch the player");
                      this.setState((state, props) => ({
                        currentPlayer: (state.currentPlayer===1 ? 2: 1),
                        remainingMoves: []  
                      }));
                    } else {
                      console.log("After the move: update the remainingMoves to exclude the one I just did");
                      this.setState({
                        movingCheckerIndex: false
                      }, () => {
                        console.log("after resetting movingcheckerIndex to false, calculate new possible moves");
                        this.executeMoves();
                      });
                      //console.assert(false, "What should I do now? Remove all other moves for that dice");
                    // this.executeMoves();
                    }
                  });
                } else {
                  this.setState({
                    newGame: false,
                    showWinnerDialog: winner
                  });
                }
              }
            });
          }

          if(this.state.remainingMoves.length === 0 && this.state.dice.length > 0) {
            console.log("player can't move");
          }
          /*
          if(playerDidMakeMove === true) {
            const newDice = [...this.state.dice];
            newDice.shift();
            this.setState({dice: newDice})
            if(newDice.length == 0) {
              console.log("no more moves available: switch the player");
              this.setState((state, props) => ({
                currentPlayer: (state.currentPlayer===1 ? 2: 1),
                remainingMoves: []
              }));
            } else {
              this.executeMoves(newDice);
            }
          }
          */
        }
      }
    }
}

  getPossibleMoves = () => {
    //let possibleMoves = Array(6).fill({dice: []});;
    let possibleMoves = {};
    //let copiedMoves = possibleMoves.map((item) => {
    //  return { moves: item.moves };
    //});

    // White moves up, Black moves down
    const info = {
      whiteMoves: this.state.currentPlayer === 1,
      lastFieldNumber: this.state.currentPlayer === 2 ? 24 : -1
    }
    // const whiteMoves = this.state.currentPlayer === 1;
    // const endFieldWhite = 24;

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
            //let movesCopy = _.cloneDeep(possibleMoves);
            this.addPossibleMove(possibleMoves, index, diceNbr);
          }
        }
      } else {

        // Now check for all other possible moves
        const diceNbr = diceIndex < this.state.dice.length ? this.state.dice[diceIndex] : undefined;
        //const diceNbr = availableMoves[0];
        for(let [index, currentField] of this.state.positions.entries()) {
          if(this.state.currentPlayer === currentField.player && currentField.pawns > 0) {
            const destIndex = info.whiteMoves ? index + diceNbr : index - diceNbr;
            const destField = this.state.positions[destIndex];

            if((info.whiteMoves && this.state.whiteIsBearingOff) || (!info.whiteMoves && this.state.blackIsBearingOff)) {
              // TODO: bearing off correct checker: https://www.gammonsite.com/bgrules.aspx#:~:text=To%20bear%20off%20one%20man,checker%20from%20the%205%20point.

              // Find either the correct die to bear off or allow to bear off the farthest checker. f.e. checker on 
              // 5 but not on 6: if user rolls a 6, the 5 can bear off.
              if(destIndex === 24 || destIndex === -1) {
                this.addPossibleMove(possibleMoves, index, diceNbr);
              } else if(destIndex > 24 || destIndex < -1) {
                if(this.state.blackIsBearingOff) {
                  let canBearOff = true;
                  for(let i = index+1; i<6; i++) {
                    if(this.state.positions[i].pawns > 0 && this.state.positions[i].player === BLACK_PLAYER) {
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

        
        // TODO: should I maybe move this to be called in a separate function before calling getPossibleMoves?
        // I don't think I can, because the player could just want to move up his pieces instead bearing off

        // Check for bearing off checker that doesn't have an exact match
        /*
        if(info.whiteMoves && this.state.whiteIsBearingOff) {
          
          // 1. Check the last checker and see if he can bear off
            for(let index = 18; index < 24; index++) {
              if(this.state.positions[index].player === this.state.currentPlayer && this.state.positions[index].pawns > 0) {
                const destIndex = index + diceNbr;
                if(destIndex >= 24) {
                  this.addPossibleMove(possibleMoves, index, diceNbr);
                  break;
                }
              }
            }
        } else if(!info.whiteMoves && this.state.blackIsBearingOff) {
          for(let index = 5; index >= 0; index--) {
            if(this.state.positions[index].player === this.state.currentPlayer && this.state.positions[index].pawns > 0) {
              const destIndex = index - diceNbr;
              if(destIndex < 0) {
                this.addPossibleMove(possibleMoves, index, diceNbr);
                break;
              }
            }
          }
        }
        */
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
  /*
    if(this.state.currentPlayer === player) {
      let count = 0;
      if(player === 1) {
        // count all pieces in white's home and check if all of them are there
        for(let index = 18; index < copiedBoard.length; index++) {
          if(copiedBoard[index].player === 1) {
            count += copiedBoard[index].pawns;
          }
        }
      } else if(player === 2) { // black's turn
        // count all pieces in black's home and check if all of them are there
        for(let index = 0; index < 6; index++) {
          if(copiedBoard[index].player === 2) {
            count += copiedBoard[index].pawns;
          }
        }
      }
      if(count <= 15) {
        //alert("Player: " + player + " can start bearing off");
        this.setState((state, props) => ({
          whiteIsBearingOff: (state.currentPlayer===1 ? true: false),
          blackIsBearingOff: (state.currentPlayer===2 ? true: false)
        }));
      }
    }
    */
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

  render() {
  
    let canRollDice = false;
    if(this.state.remainingMoves.length === 0 && this.state.newGame) {
      canRollDice = true;
    }

    let test = null;
    if(this.state.movingCheckerIndex === false) {
      test = this.onPieceSelectedHandler;
    } else {
      test = this.onPieceMovedToHandler;
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

    let test2 = true;

    return (
      <Aux>
        <Modal show={this.state.showWinnerDialog} modalClosed={this.purchaseCancelHandler}>
          <WinningDialog 
            winner={this.state.showWinnerDialog} clicked={this.gameOver}/>
        </Modal>
        <Layout>
            <Button clicked={this.startNewGameHandler} buttonType="Start">New Game</Button>
            <button onClick={this._test_BlackPutsWhiteOnBarWith3}>TEST BUG</button>
          <Board 
          pawnPositions={this.state.positions} 
          throwDice={this.onThrowDice} 
          pieceMoved={test} // TODO: rename to pieceSelected
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

    componentDidMount() {
      const IS_TESTING = true;
      if(IS_TESTING) {
        console.log("the component did mount");
        this._test_NoMoreMoves();
    //    this._test_bearOffWhite();
    //    this._test_bearOffWhite2();
    //    this._test_BlackOnBar();
        //this._test_NoMoreMoves();
        //this._test_NoMoreMoves();
        //this._test_NoMoreMoves();
      }
    }
    
}

export default App;
