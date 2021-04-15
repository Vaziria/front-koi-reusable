import firebase from 'firebase'

export interface CustomWindow extends Window {
    recaptchaVerifier?: firebase.auth.RecaptchaVerifier
}

export function getWindow (): CustomWindow {
  return window
}
