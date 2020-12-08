import React, {Component} from 'react';
import classes from './Board.module.css'
import BoardSection from './BoardSection'
import RollDiceButton from './RollDiceBtn'
import Bar from './Bar'
import Pawn from './Pawn'
import BearoffPanel from './BearoffPanel'

class Board extends Component {

    render() {
        const upperLeftPanel = <BoardSection type="upper-left" 
        pawnPositions={this.props.pawnPositions} pieceMoved={this.props.pieceMoved} 
        pieceMovedToField={this.props.pieceMovedToField} possibleMoves={this.props.possibleMoves} 
        movingCheckerIndex={this.props.movingCheckerIndex}
        currentPlayer={this.props.color}/>
        const lowerLeftPanel = <BoardSection type="lower-left" pawnPositions = {this.props.pawnPositions} pieceMoved={this.props.pieceMoved} pieceMovedToField={this.props.pieceMovedToField} possibleMoves={this.props.possibleMoves} movingCheckerIndex={this.props.movingCheckerIndex} currentPlayer={this.props.color}/>
        const upperRightPanel = <BoardSection type="upper-right" pawnPositions={this.props.pawnPositions} pieceMoved={this.props.pieceMoved} pieceMovedToField={this.props.pieceMovedToField} possibleMoves={this.props.possibleMoves} movingCheckerIndex={this.props.movingCheckerIndex} currentPlayer={this.props.color}/>
        const lowerRightPanel = <BoardSection type="lower-right" pawnPositions = {this.props.pawnPositions} pieceMoved={this.props.pieceMoved} pieceMovedToField={this.props.pieceMovedToField} possibleMoves={this.props.possibleMoves} movingCheckerIndex={this.props.movingCheckerIndex} currentPlayer={this.props.color}/>
       
        let barcomponents = [];
        if(this.props.bar[0].pawns > 0) {
            let canMovePawn = false;
            if(this.props.possibleMoves[-1] !== undefined || this.props.possibleMoves[24] !== undefined) {
                canMovePawn=true;
            }
            for(let i=0; i<this.props.bar[0].pawns; i++) {
                barcomponents.push(<Pawn key={i} Color="White" pieceMoved={this.props.pieceMoved} canMove={canMovePawn} index="-1"/>);
            }
        }
        if(this.props.bar[1].pawns > 0) {
        let canMovePawn = false;
        if(this.props.possibleMoves[-1] !== undefined || this.props.possibleMoves[24] !== undefined) {
            canMovePawn=true;
        }
          for(let i=0; i<this.props.bar[1].pawns; i++) {
            barcomponents.push(<Pawn key={i} Color="Black" pieceMoved={this.props.pieceMoved} canMove={canMovePawn} index="24"/>);
          }
        }

        // GetPossibleMove doesn't return the correct thing for movingCheckerIndex = 3 (the 4th checker). It only considers the die 1 but not 4
        let possibleMoves1 = [];
        if(this.props.movingCheckerIndex !== false && Object.keys(this.props.possibleMoves).length !== 0) {
            let destMoves = this.props.possibleMoves[this.props.movingCheckerIndex];
            possibleMoves1 = destMoves.map((dice) => {
                if(this.props.color === "Black") {
                    let destIndex = Math.max(parseInt(this.props.movingCheckerIndex) - dice + 1, 0);
                    return destIndex;
                } else {
                    let destIndex = Math.min(parseInt(this.props.movingCheckerIndex) + dice + 1, 25);
                    return destIndex;
                }
            });
        }
        
        let outerBoardInfo = {
            checkersAtHome: this.props.checkersAtHome,
            whiteCanBearOff: possibleMoves1.indexOf(25) != -1 ? true : false,
            blackCanBearOff: possibleMoves1.indexOf(0) != -1 ? true : false
        };

        return (
            <div className={classes.Board} onClick={this.props.clicked}>
                <div className={classes.LeftPanel} >
                    {upperLeftPanel} 
                    <div className={classes.Spacer}></div>  
                    {lowerLeftPanel}  
                </div>
                <div className={classes.VerticalSpacer}>
                    <RollDiceButton 
                    onClick={this.props.throwDice} 
                    roll1={this.props.roll1} 
                    roll2={this.props.roll2} 
                    roll={this.props.roll}
                    diceActiveIndex={ this.props.possibleMoves.length > 0 ? this.props.diceActiveIndex : 1000 }
                    disabled={this.props.disabled}
                    color={this.props.color}/>
                    <Bar bar={this.props.bar}>
                        {barcomponents}
                    </Bar>
                </div> 
                <div className={classes.RightPanel} >
                    {upperRightPanel} 
                    <div className={classes.Spacer}></div>  
                    {lowerRightPanel}  
                </div>
                <BearoffPanel onClick={this.props.pieceMoved} outerBoardInfo={outerBoardInfo}/>
                
            </div>
        );
    }
}

export default Board;