import React from 'react'

import Tooltip from '../Tooltip'

import useStylesArrow from './ArrowTooltip.styles'

function NaturgyArrowTooltip(props: any) {
  const { arrow, ...classes } = useStylesArrow({});
  const [arrowRef, setArrowRef] = React.useState<HTMLSpanElement | null>(null);

  return (
    <Tooltip
      classes={classes}
      PopperProps={{
        popperOptions: {
          modifiers: {
            arrow: {
              enabled: Boolean(arrowRef),
              element: arrowRef,
            },
          },
        },
      }}
      {...props}
      title={
        <React.Fragment>
          {props.title}
          <span className={arrow} ref={setArrowRef} />
        </React.Fragment>
      }
    />
  );
}

export default NaturgyArrowTooltip
