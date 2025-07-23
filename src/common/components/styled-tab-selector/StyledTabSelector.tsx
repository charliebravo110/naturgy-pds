import React from 'react'

import { NaturgyTabs, NaturgyTab, NaturgyTabsReactive } from './StyledTabSelector.styles'

export const StyledTabSelector = (props: any) => <NaturgyTabs variant='standard' {...props} />

export const StyledTabSelectorReactive = (props: any) => <NaturgyTabsReactive variant='standard' {...props} />

export const StyledTab = (props: any) => <NaturgyTab disableRipple {...props} />
