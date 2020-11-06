import React, {Component} from 'react';
import classes from './Board.module.css'
import BoardSection from './BoardSection'
import RollDiceButton from './RollDiceBtn'
import Bar from './Bar'
import Pawn from './Pawn'

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
            if(this.props.possibleMoves.indexOf(0) === -1 || this.props.possibleMoves.indexOf(0) ===24) {
                canMovePawn=true;
            }
            for(let i=0; i<this.props.bar[0].pawns; i++) {
                barcomponents.push(<Pawn key={i} Color="White" pieceMoved={this.props.pieceMoved} canMove={canMovePawn} index="-1"/>);
            }
        }
        if(this.props.bar[1].pawns > 0) {
        let canMovePawn = false;
        if(this.props.possibleMoves.indexOf(0) === -1 || this.props.possibleMoves.indexOf(0) ===24) {
            canMovePawn=true;
        }
          for(let i=0; i<this.props.bar[1].pawns; i++) {
            barcomponents.push(<Pawn key={i} Color="Black" pieceMoved={this.props.pieceMoved} canMove={canMovePawn} index="24"/>);
          }
        }
        return (
            <div className={classes.Board}>
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
                
            </div>
        );
    }
}

export default Board;