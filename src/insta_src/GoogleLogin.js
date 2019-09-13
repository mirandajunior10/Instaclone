import React from 'react'

import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
GoogleSignin.configure({
    webClientId: "390298799165-ol7dog0ng54ijfeakgkn58dp0dt1ivte.apps.googleusercontent.com",
    offlineAccess: true
});


export default class GoogleLogin extends React.Component {


    constructor() {
        super();
        this.state = {};
    }


    // Somewhere in your code
    signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            if(userInfo){
                alert(`Welcome, ${userInfo.user.name}`);
                console.log(userInfo);
                this.setState({ userInfo });
            }
            
            
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (f.e. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
            } else {
                // some other error happened
            }
        }
    };

    render() {
        return (
            <GoogleSigninButton
                style={{ width: 192, height: 48 }}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={this.signIn}
                disabled={false} />
        );
    }
}