import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    }
  },
  input: {
    flexGrow: 1,
    '& fieldset': {
      border: 'solid 1px #004571 !important',
      borderRadius: '4px 0 0 4px'
    },
    '& input': {
      padding: 14
    },
    '& label': {
      display: 'block',
      '&:not(.Mui-focused):not(.MuiFormLabel-filled)': {
        top: -3
      }
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    }
  },
  input2: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    '& fieldset': {
      border: 'solid 1px #004571 !important',
      borderRadius: '4px 0 0 4px'
    },
    '& input': {
      padding: 14
    },
    '& label': {
      display: 'block',
      '&:not(.Mui-focused):not(.MuiFormLabel-filled)': {
        top: -3
      }
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    }
  },
  input3: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    '& fieldset': {
      border: 'solid 1px #004571 !important',
      borderRadius: '4px 0 0 4px'
    },
    '& input': {
      padding: 14,
      color: '#d3222a'
    },
    '& label': {
      display: 'block',
      '&:not(.Mui-focused):not(.MuiFormLabel-filled)': {
        top: -3
      }
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    }
  },
  button: {
    width: 19,
    height: 19,
    position: 'relative',
    backgroundColor: '#004571',
    color: '#FFF',
    padding: '14px 15px',
    borderRadius: '0 4px 4px 0',
    marginLeft: -2,
    cursor: 'pointer',
    '&.filled': {
      boxShadow: '0 0 0 3px rgba(22, 116, 209, 0.4)',
      '& img': {
        transform: 'scale(0.8)',
        animation: 'scale 0.6s linear infinite'
      }
    },
    '& img': {
      height: 19.5,
      bottom: 0.5,
      [theme.breakpoints.down('sm')]: {
        height: 19,
        bottom: 0
      }
    }
  }
}))

export default useStyles
