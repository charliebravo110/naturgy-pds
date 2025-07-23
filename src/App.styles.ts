import { createTheme } from '@material-ui/core/styles'

export const theme = createTheme({
  breakpoints: {
      values: {
          xs: 0,
          sm: 577,
          md: 769,
          lg: 992,
          xl: 1200
      }
  }
})