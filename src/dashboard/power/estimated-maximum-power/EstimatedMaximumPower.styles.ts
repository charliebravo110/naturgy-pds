import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
      padding: 2
    }
  },
  maxWidthForBigScreens: {
    maxWidth: 1200,
    width: '100%'
  },
  title: {
    fontSize: 36,
    color: 'rgba(0, 69, 113, 1)'
  },
  description: {
    paddingBottom: 20,
    borderBottom: 'solid 1px #E1E9EE',
    marginTop: 16,
    color: '#555555',
    lineHeight: '20px'
  },
  label: {
    color: 'rgba(0, 69, 113, 1)'
  },
  menuItem: {
    margin: '20px 0'
  },
  graphBlock: {
    marginTop: 150,
    marginBottom: 20
  },
  graphContainer: {
    height: 110,
    width: '65%',
    borderBottom: '2px solid #F0F3F4',
    position: 'relative'
  },
  graphContainerMobile: {
    height: 55,
    borderBottom: '2px solid #F0F3F4',
    position: 'relative'
  },
  graphConsumed: {
    height: '100%',
    width: '0%',
    maxWidth: 1000,
    position: 'relative',
    backgroundColor: '#44B5BD',
    transition: 'width 1s ease-in-out'
  },
  graphConsumedNeg: {
    height: '100%',
    width: '0%',
    maxWidth: 1000,
    position: 'relative',
    backgroundColor: '#E5F4F7',
    transition: 'width 1s ease-in-out'
  },
  graphDifference: {
    height: '100%',
    width: '0%',
    position: 'relative',
    backgroundColor: '#E5F4F7',
    transition: 'width 1s ease-in-out'
  },
  graphDifferenceNegative: {
    height: '100%',
    width: '0%',
    left: '0',
    position: 'absolute',
    transition: 'width 1s ease-in-out',
    backgroundColor: '#44B5BD',
    zIndex: 1
  },
  graphBlank: {
    height: '100%',
    position: 'relative',
  },
  barConsumed: {
    position: 'absolute',
    height: 'calc(100% + 34px)',
    top: '-17px',
    right: '-2px',
    borderLeft: '4px dashed #1E98A1',
    zIndex: 1,
    [theme.breakpoints.only('xs')]: {
      borderLeft: '2px dashed #1E98A1'
    }
  },
  barMax: {
    position: 'absolute',
    height: 'calc(100% + 34px)',
    top: '-17px',
    right: '-2px',
    borderLeft: '4px solid #CE242C',
    zIndex: 1,
    [theme.breakpoints.only('xs')]: {
      borderLeft: '2px solid #CE242C'
    }
  },
  infoConsumed: {
    position: 'absolute',
    top: '-100px',
    minWidth: 110
  },
  infoConsumedNeg: {
    position: 'absolute',
    left: '100%',
    top: '-100px'
  },
  infoMax: {
    position: 'absolute',
    top: '-100px'
  },
  infoMaxNeg: {
    position: 'absolute',
    top: '-100px',
    width: '190px'
  },
  infoLabel: {
    fontSize: 18,
    textAlign: 'right',
    letterSpacing: '1px',
    color: 'rgba(0, 69, 113, 1)'
  },
  infoW: {
    fontSize: 18,
    color: '#96A6B4',
    position: 'absolute',
    top: 10,
    right: -30,
    [theme.breakpoints.only('xs')]: {
      top: 7,
      right: -35,
    }
  },
  infoNumberConsumed: {
    width: 'fit-content',
    display: 'table',
    fontSize: 30,
    letterSpacing: 1,
    color: '#1E98A1',
    position: 'relative',
    [theme.breakpoints.only('xs')]: {
      fontSize: 46
    }
  },
  infoNumberConsumedMobile: {
    width: 'fit-content',
    display: 'table',
    fontSize: 30,
    letterSpacing: 1,
    color: '#1E98A1',
    position: 'relative',
    [theme.breakpoints.only('xs')]: {
      fontSize: 46
    }
  },
  infoNumberMax: {
    width: 'fit-content',
    display: 'table',
    fontSize: 30,
    letterSpacing: 1,
    marginRight: 30,
    color: '#CE242C',
    position: 'relative',
    [theme.breakpoints.only('xs')]: {
      fontSize: 46
    }
  },
  rulerContainer: {
    height: 15,
    marginBottom: 30,
    width: '65%'
  },
  rulerPart: {
    position: 'relative',
    borderLeft: '2px solid #F0F3F4'
  },
  rulerW: {
    position: 'absolute',
    fontSize: 14,
    bottom: '-20px',
    left: '-15px',
    color: 'rgba(0, 69, 113, 1)'
  },
  mobileLabelsContainer: {
    marginBottom: -120,
    paddingTop: 30
  },
  mobileMargin: {
    marginBottom: 20
  },
  estimatedLabel: {
    alignItems: 'flex-end',
    paddingRight: 40
  }
}))

export default useStyles