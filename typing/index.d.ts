declare global {
    interface Window {
        recaptchaVerifier?: firebase.auth.RecaptchaVerifier
        fireconfig?: {
            databaseURL: string
            apiKey: string
            authDomain: string
            projectId: string
            storageBucket: string
            messagingSenderId: string
            appId: string
            measurementId: string
        }
    }
}
