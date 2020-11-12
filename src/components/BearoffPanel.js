import React from 'react'
import classes from './BearoffPanel.module.css'
import Aux from '../hoc/Auxx';
import CheckerOffBoard from './CheckerOffBoard'

const bearoffPanel = (props) => {

    let whiteFieldCanReceive = props.outerBoardInfo.whiteCanBearOff;
    let blackFieldCanReceive = props.outerBoardInfo.blackCanBearOff;
    let allClassesWhite = whiteFieldCanReceive ? [classes.Test2, classes.CanReceiveChecker] : [classes.Test2];
    let allClassesBlack = blackFieldCanReceive ? [classes.Test, classes.CanReceiveChecker] : [classes.Test];

    const whiteCheckers = () => {
        const checkerArray = [];
        let size = props.outerBoardInfo.checkersAtHome.whiteCheckers;
        for(let i=0; i<size; i++) {
            checkerArray.push(<CheckerOffBoard color={"White"} />);
        }
        return checkerArray;
    };

    const blackCheckers = () => {
        const checkerArray = [];
        let size = props.outerBoardInfo.checkersAtHome.blackCheckers;
        for(let i=0; i<size; i++) {
            checkerArray.push(<CheckerOffBoard color={"Black"} />);
        }
        return checkerArray;
    };

    const whiteCheckers1 = whiteCheckers();
    const blackCheckers1 = blackCheckers();
    return (
    <Aux>
    <div className={classes.BearOffPanel}>
        <div className={allClassesWhite.join(" ")} onClick={() => whiteFieldCanReceive ? props.onClick(25/*window.WHITE_HOME_INDEX*/) : undefined }>
            {whiteCheckers1}
        </div>
        <div className={allClassesBlack.join(" ")} onClick={() => blackFieldCanReceive ? props.onClick(0/*window.BLACK_HOME_INDEX*/) : undefined }>
            {blackCheckers1}
        </div>
    {props.children}
    </div>
    </Aux>
    )
}

export default bearoffPanel;