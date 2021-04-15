import firebase from 'firebase'

export interface CustomWindow extends Window {
    recaptchaVerifier?: firebase.auth.RecaptchaVerifier | undefined
}

export function getWindow (): CustomWindow {
  return window as CustomWindow
}
