import Cookies from 'js-cookie'

const TokenKey = 'lodi-token'
const TokenNameKey = 'tokenName'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function getTokenName() {
  return Cookies.get(TokenNameKey)
}

export function setToken(token) {
  Cookies.set(TokenNameKey, token.tokenName)
  return Cookies.set(TokenKey, token.tokenValue)
}

export function removeToken() {
  Cookies.remove(TokenNameKey)
  return Cookies.remove(TokenKey)
}
