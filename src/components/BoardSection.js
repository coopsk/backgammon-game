import React from 'react';
import classes from './BoardSection.module.css'
import TriangleField from './TriangleField'
import Pawn from './Pawn'

const boardSection = (props) => {

    /*
    var parentEl = document.getElementById("cards");

    function sortPawns() {
        var cards = document.getElementsByClassName(classes.PawnWrapper),
        cw = parentEl.clientWidth,
        sw = parentEl.scrollWidth,
        diff = sw - cw,
        offset = diff / (cards.length - 1);

        for (var i = 1; i < cards.length; i++) {
            cards[i].style.transform = "translateX(-" + offset * i + "px)";
        }
    }
    */

    function getSelectableFields() {
        let possibleMoves = [];
        if(props.movingCheckerIndex === false) { 
            const possibleMoveIndexArray = Object.keys(props.possibleMoves);
            possibleMoves = possibleMoveIndexArray.map((item) => {
                return Number(item);
            });
        }
        return possibleMoves;
    }

    function getDestinationFields(currentIndex, color) {
        let possibleMoves = [];
        if(props.movingCheckerIndex !== false && Object.keys(props.possibleMoves).length !== 0) {
            let destMoves = props.possibleMoves[props.movingCheckerIndex];
            possibleMoves = destMoves.map((dice) => {
                if(props.currentPlayer === "Black") {
                    let destIndex = Math.max(parseInt(props.movingCheckerIndex) - dice + 1, 0);
                    return destIndex;
                } else {
                    let destIndex = Math.min(parseInt(props.movingCheckerIndex) + dice + 1, 25);
                    return destIndex;
                }
            });
        }
        return possibleMoves;
    }

    function createPawnsOnBoard(position) {
        const pawns = [];
        const index = position - 1;
        
        if(props.pawnPositions[index]) {
            let nbr = props.pawnPositions[index].pawns;
            let color;
            if(props.pawnPositions[index].player === 1)
                color = "White";
            else
                color = "Black";

            let canMovePawn = false;
            const checkMoves = getSelectableFields();
            if(checkMoves.indexOf(index) !== -1) {
                canMovePawn = true;
            }
            for(let i=0;i<nbr; i++) {
                pawns.push(<Pawn key={i} Color={color} pieceMoved={props.pieceMoved} index={index} canMove={canMovePawn}/>);
            }
        }

        let contentAlignStyle = {
            justifyContent: "flex-end"
        };

        if(position >= 13)
            contentAlignStyle.justifyContent = "flex-start";

        return (
            <div className={classes.PawnWrapper} style={contentAlignStyle}>
            {pawns}
            {props.children}
            </div>
        );
    }

    function constructField(index, color, direction) {

        const destinationFields = getDestinationFields(index, color);
        let canReceive = destinationFields.indexOf(index) != -1;
        return (
            <TriangleField Color={color} Direction={direction} pieceMoved={props.pieceMoved} isDestField={canReceive} index={index}>
            {createPawnsOnBoard(index)}
        </TriangleField>);
    }
    
    let section = null;

    if(props.type === "upper-left" || props.type === "upper-right") {
        let offset = 0;
        if(props.type === "upper-right" ) {
            offset = 6;
        }
        
        section = (
        <div className={classes.BoardSection}>
            {constructField(13+offset, "White", "down")}
            {constructField(14+offset, "Black", "down")}
            {constructField(15+offset, "White", "down")}
            {constructField(16+offset, "Black", "down")}
            {constructField(17+offset, "White", "down")}
            {constructField(18+offset, "Black", "down")}
           
        </div>)
        
    }
    else if(props.type === "lower-left" || props.type === "lower-right") {
        let offset = 0;
        if(props.type === "lower-left" ) {
            offset = 6;
        }
        
        section = <div className={classes.BoardSection}>
            {constructField(6+offset, "Black", "up")}
            {constructField(5+offset, "White", "up")}
            {constructField(4+offset, "Black", "up")}
            {constructField(3+offset, "White", "up")}
            {constructField(2+offset, "Black", "up")}
            {constructField(1+offset, "White", "up")}
           
            </div> 
    }
    const style = {
        height: "100%"
    }

    return (
        <div style={style}>
        {section}
        </div>
    );
}

export default boardSection;