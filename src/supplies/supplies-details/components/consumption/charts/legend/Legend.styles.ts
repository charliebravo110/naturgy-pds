import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: '#F8F7F5',
    padding: 30,
    borderRadius: 10,
    marginTop: 40
  },
  topContainer: {
    padding: 30,
    borderRadius: 10,
    marginTop: 40,
    justifyContent: 'center',
    textAlign: 'center'
  },
  dateContainer: {
    justifyContent: 'flex-end',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center'
    }
  },
  dateContainer2: {
    justifyContent: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center'
    }
  },
  section: {
    '&.border': {
      paddingTop: 20,
      borderTop: 'solid 1px #D9D8D6',
      marginTop: 20,
      justifyContent: 'space-between'
    }
  },
  sectionSelfConsumption: {
    '&.border': {
      paddingTop: 20,
      borderTop: 'solid 1px #D9D8D6',
      marginTop: 20,
      justifyContent: 'space-between'
    },
    '&.border2': {
      paddingTop: 20,
      borderTop: 'solid 3px #D9D8D6',
      marginTop: 20,
      justifyContent: 'space-between'
    }
  },
  item: {
    alignItems: 'center',
    marginBottom: 5,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 10
    }
  },
  item2: {
    alignItems: 'center',
    marginBottom: 5,
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      marginBottom: 10
    }
  },
  label: {
    color: '#777',
    marginLeft: 15,
    marginRight: 15,
    '& span': {
      color: '#004571',
      fontWeight: 'bold'
    },
    [theme.breakpoints.only('xs')]: {
      marginTop: 2
    }
  },
  label2: {
    color: '#777',
    marginLeft: 10,
    marginRight: 15,
    marginTop: 10,
    '& span': {
      color: '#004571',
      fontWeight: 'bold'
    },
    [theme.breakpoints.only('xs')]: {
      marginTop: 2
    }
  },
  label3: {
    color: '#777',
    marginLeft: 10,
    marginRight: 15,
    fontSize: 13,
    '& span': {
      color: '#004571',
      fontWeight: 'bold'
    },
    [theme.breakpoints.only('xs')]: {
      marginTop: 2
    }
  },
  label4: {
    color: '#777',
    marginRight: 15,
    '& span': {
      color: '#004571',
      fontWeight: 'bold'
    },
    [theme.breakpoints.only('xs')]: {
      marginTop: 2
    }
  },
  labelTop: {
    color: '#777',
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10,
    '& span': {
      color: '#004571',
      fontWeight: 'bold',
      marginRight: 15
    },
    [theme.breakpoints.only('xs')]: {
      marginTop: 2
    }
  },
  labelDate: {
    color: '#777',
    marginLeft: 10,
    marginRight: 25,
    '& span': {
      color: '#004571',
    },
    [theme.breakpoints.only('xs')]: {
      marginTop: 2
    }
  },
  labelTitle: {
    marginRight: 10
  },
  paragraphs: {
    lineHeight: 2.5,
    marginTop: 16,
    '& p': {
      color: '#555555',
      margin: 0
    },
    '& p img': {
      position: 'relative',
      top: -4,
      left: 2
    },
    '& p span': {
      position: 'relative',
      top: -8,
      fontSize: 12
    }
  },
  space: {
    justifyContent:'flex-start'
  },
  whiteTextRed: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d3222a',
    color: '#ffffff',
    borderRadius: 10,
    fontSize: 11,
    textAlign: 'center'
},
whiteTextRed2: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d3222a',
    color: '#ffffff',
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    fontSize: 11,
    textAlign: 'center'
},
whiteTextOrange: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e57200',
    color: '#ffffff',
    borderRadius: 10,
    fontSize: 11,
    textAlign: 'center'
},
whiteTextYellow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#edab46',
    color: '#ffffff',
    borderRadius: 10,
    fontSize: 11,
    textAlign: 'center'
},
whiteTextYellow2: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#edab46',
    color: '#ffffff',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    fontSize: 11,
    textAlign: 'center'
},
whiteTextGreen: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#bfbf60',
    color: '#ffffff',
    borderRadius: 10,
    fontSize: 11,
    textAlign: 'center'
},
whiteTextDarkGreen: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5fad83',
    color: '#ffffff',
    borderRadius: 10,
    fontSize: 11,
    textAlign: 'center'
},
whiteTextBlue: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#009aa6',
    color: '#ffffff',
    borderRadius: 10,
    fontSize: 11,
    textAlign: 'center'
},
whiteTextGrey: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(191, 184, 174, 1)',
    color: '#ffffff',
    borderRadius: 10,
    fontSize: 11,
    textAlign: 'center',
    paddingRight: 8.5,
    paddingLeft: 8.5
},
whiteTextGrey2: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(191, 184, 174, 1)',
    color: '#ffffff',
    borderRadius: 10,
    fontSize: 11,
    textAlign: 'center'
},
testlebel: {
  fontSize: 13
}
}))

export default useStyles
