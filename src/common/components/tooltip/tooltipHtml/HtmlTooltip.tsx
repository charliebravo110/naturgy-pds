import React from 'react'

import Tooltip from '../Tooltip'

import useStylesTooltip from './HtmlTooltip.styles'

function NaturgyHtmlTooltip(props: any) {
  const { arrow, ...classes } = useStylesTooltip({});
  const [arrowRef, setArrowRef] = React.useState<HTMLSpanElement | null>(null);

  const createMarkup = (string) => {
    return {__html: string};
  }

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
          <div dangerouslySetInnerHTML={createMarkup(props.title)}/>
        </React.Fragment>
      }
    />
  );
}

export default NaturgyHtmlTooltip
