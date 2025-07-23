import React from 'react'

// https://www.npmjs.com/package/react-google-recaptcha
import ReCAPTCHA from 'react-google-recaptcha'

//Captcha para local
//const RECAPTCHA_SITEKEY = '6Lfopa8UAAAAABTim8tnsDT0ku6NJx_G3M3AcKTN'
const RECAPTCHA_SITEKEY = process.env.REACT_APP_CAPTCHA_PUBLIC_KEY

const Recaptcha = (props: any) => {
  const onChange = (value) => {
    props.onChangeCaptcha(value)
  }

  return (
    <ReCAPTCHA
      sitekey={RECAPTCHA_SITEKEY}
      onChange={onChange}
    />
  )
}

export default Recaptcha
