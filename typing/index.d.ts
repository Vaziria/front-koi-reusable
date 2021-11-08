import firebase from 'firebase'

declare global {
    interface Window {
        recaptchaVerifier: firebase.auth.RecaptchaVerifier
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        __INITIAL_STATE__: any
    }
}
