let token = (() => {
  let token = localStorage.getItem('jwtf')
  if (token) {
    const payload = JSON.parse(window.atob(token.split('.')[1]))
    if (payload.exp > Date.now() / 1000) {
      return token
    } else {
      return null
    }
  } else {
    return null
  }
})()
export default {
  token
}
