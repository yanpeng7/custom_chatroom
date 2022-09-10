// browser storage using localStorage
const userID = 'userid'

export function setUserid (newid) {
  localStorage.setItem(userID, newid)
}

export function getUserid () {
  return localStorage.getItem(userID)
}
