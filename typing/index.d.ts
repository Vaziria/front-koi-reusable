import firebase from 'firebase'

declare global {
    interface Window {
        recaptchaVerifier: firebase.auth.RecaptchaVerifier
        __INITIAL_STATE__: any
    }
}
