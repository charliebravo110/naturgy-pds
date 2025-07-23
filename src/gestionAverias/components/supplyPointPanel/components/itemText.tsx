import React, { ReactNode } from 'react'
// import useStyles from '../failure-result-page/FailureResultPage.styles.ts';
import useStyles from '../../failure-result-page/FailureResultPage.styles'

interface TItemText {
    title: ReactNode,
    text?: ReactNode,
    className?: string
}
export const ItemText = ({ title, text, className }: TItemText) => {
    const styles = useStyles({});

    return <div className={`${styles.item_resume} ${className ? className : ''}`}>
        <span className={styles.h5}>
            {title}{text ? ': ' : ''}
        </span>
        <span>
            {text}
        </span>
    </div>
}