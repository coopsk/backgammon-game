import Aux from '../hoc/Auxx';
import React from 'react';
import classes from './Layout.module.css';

const layout = (props) => (
    <Aux>
    <main className={classes.Content}>
        {props.children}
    </main>
    </Aux>
    )

export default layout;