import React from 'react'
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import { Text, View } from 'react-native';
import { webClientID } from '../../config/firebaseconfig';
import { auth } from '../../config/config';

export default function LogoutButton() {

    async function signOut() {
        var that = this
        GoogleSignin.configure({
            webClientId: webClientID,
            offlineAccess: true

        });

        if (auth.currentUser) {
            await auth.signOut();
            await GoogleSignin.signOut();
        }
        else {
            alert("Already logged out!");
        }

    }


    return (
        <View>
            <Text>You are logged in</Text>
            <GoogleSigninButton
                style={{ width: 192, height: 48 }}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={signOut}
            />
        </View>
    )

}