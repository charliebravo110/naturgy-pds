/** helper function to validate a semver string (major.minor.patchAND-OPTIONAL-STUFF) */
export function isValidSemver(semverString: string) {
  const regex =
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/
  // 👆 this regex is from https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
  return regex.test(semverString)
}

/** helper function to compare two semver strings (major.minor.patchAND-OPTIONAL-STUFF)
 * returns 1 if a > b
 * returns -1 if a < b */
export function compareSemver(a: string, b: string) {
  let aParts = a.split('.').map((x) => parseInt(x, 10))
  let bParts = b.split('.').map((x) => parseInt(x, 10))

  // keep only the first 3 parts
  aParts = aParts.slice(0, 3)
  bParts = bParts.slice(0, 3)

  //remove from last part all the non-numeric characters at the end
  aParts[2] = parseInt(aParts[2].toString().replace(/[^0-9]/g, ''), 10)
  bParts[2] = parseInt(bParts[2].toString().replace(/[^0-9]/g, ''), 10)

  for (let i = 0; i < 3; i++) {
    if (aParts[i] > bParts[i]) return 1
    if (aParts[i] < bParts[i]) return -1
  }
  return 0
}

/** returns the current version of the app */
export function getCurrentVersion() {
  return process.env.REACT_APP_VERSION || '0.0.0'
}
