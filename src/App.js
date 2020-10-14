import React, { Component } from 'react';
import './App.css';
import Board from './components/Board';
import Layout from './Layout/Layout';


class App extends Component {

  state = {
    positions: Array(24).fill({ player: 0, pawns: 0 }),
    newGame: false,
    currentPlayer: 1,
    dice: [],
    newDiceIndex: 0,
    remainingMoves: [],
    bar: Array(2).fill( {pawns: 0 })
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
    points[5] = { player: 2, pawns: 5 };
    points[7] = { player: 2, pawns: 3 };
    points[12] = { player: 2, pawns: 5 };
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

  _test_checkWhiteIsBearingOff = () => {
    let points = Array(24).fill({player: 0, pawns: 0});
    points[14] = { player: 1, pawns: 1 };
    points[18] = { player: 1, pawns: 2 };
    points[19] = { player: 1, pawns: 1 };
    points[20] = { player: 1, pawns: 4 };
    points[21] = { player: 1, pawns: 2 };
    //points[22] = { player: 1, pawns: 0 };
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
      this.onThrowDice(4, 1);
    });

  }

  // TODO: Anna can fill this out
  _test_checkBlackIsBearingOff = () => {
    let points = Array(24).fill({player: 0, pawns: 0});
    points[0] = { player: 1, pawns: 1 };
    points[1] = { player: 1, pawns: 2 };
    points[19] = { player: 1, pawns: 1 };
    points[20] = { player: 1, pawns: 4 };
    points[21] = { player: 1, pawns: 2 };
    //points[22] = { player: 1, pawns: 0 };
    points[23] = { player: 1, pawns: 5 };
    
    
    let bar = Array(2).fill( {pawns: 0 })

    this.setState({
      
      positions: points,
      newGame: true,
      currentPlayer: 1,
      dice: [],
      remainingMoves: [],
      bar
    },  () => {
      this.onThrowDice(4, 1);
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
    //console.log("Throw dice for player: " + this.state.currentPlayer + ": " + dice1 + ", " + dice2);
    this.setState({
      dice: dice
    }, () => {
       //console.log("testing dice after setState: " + this.state.dice[0]);
       this.executeMoves(0, args.length === 3 ? args[2] : null);
     });
  }

  executeMoves = (newDiceIndex, calculateMoveFinished) => {

    if(newDiceIndex < this.state.dice.length)
    {
      // Check if there are any possible moves with currentMove for currentPlayer
      const remainingMoves = this.getPossibleMoves(/*availableMoves*/newDiceIndex); // I DON'T THINK I CAN RELY ON THE STATE BEING UPDATED ALREADY
      //console.log("FOUND MOVES: " + remainingMoves.length);
      //if(remainingMoves.length !== 0) {
        this.setState({
          remainingMoves: remainingMoves
        }, () => {
          if(this.state.remainingMoves.length === 0) {
            // if I can't make any move, skip that dice and process the next one
            //const newDice = [...this.state.dice];
            //newDice.shift();
            //this.setState({dice: newDice})
            this.setState((prevState, props) =>({
              newDiceIndex: prevState.newDiceIndex+1
             }), () => {
              if(this.state.newDiceIndex >= this.state.dice.length) {
                console.log("no more moves available: switch the player");
                this.setState((state, props) => ({
                  currentPlayer: (state.currentPlayer===1 ? 2: 1),
                  remainingMoves: []  
                }), () => {
                  calculateMoveFinished();
                });
              } else {
                this.executeMoves(this.state.newDiceIndex, calculateMoveFinished);
              }
             });
            } else {
              if(calculateMoveFinished) {
                calculateMoveFinished();
              }
            }
          });
    }
  }

  onPieceMovedHandler = (index) => {
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

    
    if( pieceOnBar === true/*actualIndex === -1*/ || (actualIndex >= 0 && actualIndex < 24 && this.state.positions[actualIndex].pawns)) {
      let color;
      if(pieceOnBar === false /*actualIndex !== -1*/) {
        color = this.state.positions[actualIndex].player === 1 ? "White" : "Black";
      }
      if((currentPlayer === 1 && color === "White") || (currentPlayer === 2 && color === "Black") || pieceOnBar === true /*actualIndex === -1*/) {
        console.log("Current Player clicked to move: " + color);
        let move = this.state.remainingMoves.find(x => x.index === actualIndex);
        if(move) {
          playerDidMakeMove = true;
          if(move.diceNbr !== this.state.dice[0]) {
            console.log("MOVING WITH WRONG DICE"); 
          }
          console.log("move piece on field: " + move.index + ", dice: " + move.diceNbr);
          //let copiedBoard = [...this.state.positions];
          let destIndex = currentPlayer === 1 ? actualIndex + move.diceNbr : actualIndex - move.diceNbr;
          if(pieceOnBar === false/*actualIndex !== -1*/)
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
          if(pieceOnBar === false /*actualIndex !== -1*/ && copiedBoard[actualIndex].pawns === 0)
            copiedBoard[actualIndex].player = 0;

          // Check if the piece is bearing off. If yes, don't try getting destination field
          if(destIndex < 24) {
           

            // Check if a piece was hit
            let destField = copiedBoard[destIndex];
            if(destField.pawns === 1 && destField.player !== currentPlayer) {
              // Piece was hit
              copiedBar[destField.player-1].pawns++;
              destField.pawns = 1;
              destField.player = currentPlayer;
              
            } else {
              destField.pawns = copiedBoard[destIndex].pawns + 1;
              if(copiedBoard[destIndex].pawns > 0) {
                console.log("update the current player");
                copiedBoard[destIndex].player = currentPlayer;
              }
            }
          }

          this.setState({
            positions: copiedBoard,
            bar: copiedBar
          }, () => {
            if(playerDidMakeMove === true) {
             // const newDice = [...this.state.dice];
             // newDice.shift();
            //  this.setState({dice: newDice})
             // if(newDice.length == 0) {
               this.checkPlayerIsBearingOff(currentPlayer);
               this.setState((prevState, props) => ({
                newDiceIndex: prevState.newDiceIndex+1
               }), () => {
                if(this.state.newDiceIndex >= this.state.dice.length) {
                  console.log("no more moves available: switch the player");
                  this.setState((state, props) => ({
                    newDiceIndex: 0,
                    currentPlayer: (state.currentPlayer===1 ? 2: 1),
                    remainingMoves: []  
                  }));
                } else {
                  this.executeMoves(this.state.newDiceIndex);
                }
               });
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

  getPossibleMoves = (diceIndex /*availableMoves*/) => {
    let possibleMoves = [];

    // White moves up, Black moves down
    const info = {
      whiteMoves: this.state.currentPlayer === 1,
      lastFieldNumber: this.state.currentPlayer === 2 ? 25 : -1
    }
   // const whiteMoves = this.state.currentPlayer === 1;
   // const endFieldWhite = 24;

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
          possibleMoves.push({index, diceNbr});
        } else if(destField.pawns > 1 && destField.player !== this.state.currentPlayer) {
          // check if opponent has two or more pieces on it
          console.log("FIELD ALREADY OCCUPIED BY OPPONENT: " + destIndex);
        } else {
          // TODO: don't add duplicates
          possibleMoves.push({index, diceNbr});
        }
      }
      return possibleMoves;
    }
   
    // Now check for all other possible moves
    const diceNbr = diceIndex < this.state.dice.length ? this.state.dice[diceIndex] : undefined;
     //const diceNbr = availableMoves[0];
    for(let [index, currentField] of this.state.positions.entries()) {
      if(this.state.currentPlayer === currentField.player && currentField.pawns > 0) {
        const destIndex = info.whiteMoves ? index + diceNbr : index - diceNbr;
        const destField = this.state.positions[destIndex];
        if((info.whiteMoves && this.state.whiteIsBearingOff) || (!info.whiteMoves && this.state.blackIsBearingOff)) {
          // bearing off correct checker
          if(destIndex === 24 || destIndex === -1) {
            possibleMoves.push({index, diceNbr});
          }
        }
        else if(destIndex >= 0 &&  destIndex < 24) {
          // check if opponent was hit
          if(destField.pawns === 1 && destField.player !== this.state.currentPlayer) {
            console.log("HIT OPPONENT PIECE: " + destIndex);
            possibleMoves.push({index, diceNbr});
          } else if(destField.pawns > 1 && destField.player !== this.state.currentPlayer) {
            // check if opponent has two or more pieces on it
            console.log("FIELD ALREADY OCCUPIED BY OPPONENT: " + destIndex);
          } else {
            // TODO: don't add duplicates
            possibleMoves.push({index, diceNbr});
          }
        }
      }
    }

    
    // TODO: should I maybe move this to be called in a separate function before calling getPossibleMoves?
    // I don't think I can, because the player could just want to move up his pieces instead bearing off

    // Check for bearing off checker that doesn't have an exact match
    if(info.whiteMoves && this.state.whiteIsBearingOff) {
      
      // 1. Check the last checker and see if he can bear off
        for(let index = 18; index < 24; index++) {
          if(this.state.positions[index].player === this.state.currentPlayer && this.state.positions[index].pawns > 0) {
            const destIndex = index + diceNbr;
            if(destIndex >= 24) {
              possibleMoves.push({index, diceNbr});
              break;
            }
          }
        }
    } else if(!info.whiteMoves && this.state.blackIsBearingOff) {
      for(let index = 5; index >= 0; index--) {
        if(this.state.positions[index].player === this.state.currentPlayer && this.state.positions[index].pawns > 0) {
          const destIndex = index - diceNbr;
          if(destIndex < 0) {
            possibleMoves.push({index, diceNbr});
            break;
          }
        }
      }
    }
 
    
/*
      // TODO: add loop until all dice are gone
      const highDie = [...this.state.dice].sort().reverse()[0];
      if(this.state.positions[highDie-1].player === this.state.currentPlayer && this.state.positions[highDie-1].pawns > 0) {
        console.log("Can bear off the dice: " + highDie);
        let test = info.whiteMoves ? -1 : 24;
        possibleMoves.push({test, highDie});
      }
*/
    return possibleMoves;
  }

  /**
   * Check if each player is bearing off after each move
   */
  checkPlayerIsBearingOff = ( player ) => {

    let copiedBoard = [...this.state.positions];
    
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
      if(count === 15) {
        //alert("Player: " + player + " can start bearing off");
        this.setState((state, props) => ({
          whiteIsBearingOff: (state.currentPlayer===1 ? true: false),
          blackIsBearingOff: (state.currentPlayer===2 ? true: false)
        }));
      }
    }
  }

  render() {
  
   

    let canRollDice = false;
    if(this.state.remainingMoves.length === 0 && this.state.newGame)
      canRollDice = true;

    // Create array with all the indices that can move
    let possibleMoveIndexArray = this.state.remainingMoves.map(item => (
      item = item.index
    ));
    
    return (
      <Layout>
          <button onClick={this.startNewGameHandler}>New Game</button>
          <button onClick={this._test_BlackOnBar}>TEST BUG</button>
        <Board 
        pawnPositions={this.state.positions} 
        throwDice={this.onThrowDice} 
        pieceMoved={this.onPieceMovedHandler} 
        roll1={this.state.dice[0]}  
        roll2={this.state.dice[1]} 
        roll={this.state.dice}
        diceActiveIndex={this.state.newDiceIndex}
        disabled={!canRollDice}
        color={this.state.currentPlayer === 1 ? "White" : "Black"}
        bar={this.state.bar}
        possibleMoves={possibleMoveIndexArray}/>
        
        </Layout>
      );
      
    }


    componentDidMount() {
      const IS_TESTING = false;
      if(IS_TESTING) {
        console.log("the component did mount");
    //    this._test_NoMoreMoves();
    //    this._test_bearOffWhite();
    //    this._test_bearOffWhite2();
        this._test_BlackOnBar();
        //this._test_NoMoreMoves();
        //this._test_NoMoreMoves();
        //this._test_NoMoreMoves();
      }
    }
}

export default App;
