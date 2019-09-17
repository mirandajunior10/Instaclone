import React, { useState, useEffect } from 'react';
import { f, auth, database } from '../../config/config';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import { webClientID } from '../../config/firebaseconfig';



export default class userAuth extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            authStep: 0,
            email: '',
            password: '',
            moveScreen: false,

        }
    }
    async login() {
        //Force user to login
        var email = this.state.email;
        var password = this.state.password;
        if (email != '' && password != '') {
            try {
                let user = await auth.signInWithEmailAndPassword(email, password); //'test@user.com', 'password'


            } catch (error) {
                console.log(error);
                alert(error)
            }
        } else {
            alert('email or password is empty..')
        }

    }

    
    async signUp() {
        //Force user to login
        var email = this.state.email;
        var password = this.state.password;
        if (email != '' && password != '') {
            try {
                let snapshot = await auth.createUserWithEmailAndPassword(email, password);
                this.createUserObject(snapshot.user, email);


            } catch (error) {
                console.log(error);
                alert(error)
            }
        } else {
            alert('email or password is empty..')
        }

    }

    // showLogin() {
    //     if (this.state.moveScreen == true) {
    //         this.props.navigation.navigate('Upload', { login: true, signUp: false });
    //         return false;
    //     }
    //     this.setState({ authStep: 1 });
    // }

    // showSignUp() {
    //     if (this.state.moveScreen == true) {
    //         this.props.navigation.navigate('Upload', { signUp: true, login: false });
    //         return false;
    //     }
    //     this.setState({ authStep: 2 })
    // }

    async onLoginOrRegister() {
        try {

            // Add any configuration settings here:
            GoogleSignin.configure({
                webClientId: webClientID,
                offlineAccess: true,


            });

            //user = await GoogleSignin.signInSilently();


            await GoogleSignin.hasPlayServices();
            const data = await GoogleSignin.signIn();


            if (data) {

                // create a new firebase credential with the token
                const credential = f.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);

                // login with credential
                const currentUser = await auth.signInWithCredential(credential);

                if (currentUser.additionalUserInfo.isNewUser) {
                    var uObj = {
                        name: currentUser.additionalUserInfo.profile.name,

                        avatar: currentUser.additionalUserInfo.profile.picture,
                        email: currentUser.additionalUserInfo.profile.email
                    };
                    console.log("New user", uObj);
                    database.ref('users').child(currentUser.user.uid).set(uObj);
                }
            }




            //console.info(JSON.stringify(currentUser.toJSON()));
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
                console.log("User cancelled the login flow", error);
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (f.e. sign in) is in progress already
                console.log("Sign in is in progress already", error);
                alert("Already signing in, please wait.")

            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
                console.log("Play services not availabe", error)
                alert("Please download Google Services")
            } else {
                // some other error happened
            }
        }

    }

    // useEffect(() => {
    //     auth.onAuthStateChanged(user => {
    //         if (user) {
    //            // const userGoogle = await GoogleSignin.signInSilently();
    //             console.log(user);
    //             //setLoggedIn(true);
    //         } else {
    //             //not logged in
    //             setLoggedIn(false);

    //         }
    //     });

    // }, []);
    render() {
        return (
            <View style={styles.view}>

                {this.state.authStep == 0 ? (

                    <View style={styles.loginView}>
                        <Text>You are not logged in</Text>
                        <Text>{this.props.message}</Text>
                        <GoogleSigninButton
                            style={{ width: 192, height: 48 }}
                            size={GoogleSigninButton.Size.Wide}
                            color={GoogleSigninButton.Color.Dark}
                            onPress={this.onLoginOrRegister}
                            disabled={false} />

                        <Text style={styles.orText}>or</Text>
                        <TouchableOpacity
                            onPress={() => this.showSignUp()}>
                            <Text style={styles.signUpText}>Sign up</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                        <View style={styles.LoginSignUp}>
                            {this.state.authStep == 1 ? (
                                //Login
                                <View>
                                    <TouchableOpacity
                                        onPress={() => this.setState({ authStep: 0 })}
                                        style={styles.cancelButton}>
                                        <Text style={styles.cancelText}>⬅️ Cancel</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.loginHeader}>Login</Text>
                                    <Text>Email adress:</Text>
                                    <TextInput
                                        editable={true}
                                        keyboardType={"email-address"}
                                        placeholder={'enter your email adress..'}
                                        onChangeText={text => setEmail(text)}
                                        value={email}
                                        style={styles.emailInput} />

                                    <Text>Password:</Text>
                                    <TextInput
                                        editable={true}
                                        secureTextEntry={true}
                                        placeholder={'enter your password..'}
                                        onChangeText={text => this.setState({ caption: text })}
                                        value={this.state.password}
                                        style={styles.emailInput} />

                                    <TouchableOpacity
                                        onPress={() => this.login()}
                                        style={styles.loginButton}>
                                        <Text style={styles.loginButtonText}>Login</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                    //Sign up
                                    <View>
                                        <TouchableOpacity
                                            onPress={() => this.setState({ authStep: 0 })}
                                            style={styles.cancelButton}>
                                            <Text style={styles.cancelText}>⬅️ Cancel</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.loginHeader}>Sign up</Text>
                                        <Text>Email adress:</Text>
                                        <TextInput
                                            editable={true}
                                            keyboardType={"email-address"}
                                            placeholder={'enter your email adress..'}
                                            onChangeText={text => this.setState({ email: text })}
                                            value={this.state.email}
                                            style={styles.emailInput} />

                                        <Text>Password:</Text>
                                        <TextInput
                                            editable={true}
                                            secureTextEntry={true}
                                            placeholder={'enter your password..'}
                                            onChangeText={text => this.setState({ password: text })}
                                            value={this.state.password}
                                            style={styles.emailInput} />

                                        <TouchableOpacity
                                            onPress={() => this.signUp()}
                                            style={styles.signUpButton}>
                                            <Text style={styles.loginButtonText}>SignUp</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                        </View>)}
            </View>
        );
    }
}



const styles = StyleSheet.create({
    view: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },
    loginView: {
        //flexDirection: 'row',
        marginVertical: 20,
    },
    loginText: {
        fontWeight: 'bold',
        color: 'green'
    },
    signUpText: {
        fontWeight: 'bold',
        color: 'blue'
    },
    orText: {
        marginHorizontal: 10
    },
    LoginSignUp: {
        marginVertical: 20,
    },
    cancelButton: {
        borderBottomWidth: 1,
        paddingVertical: 5,
        marginBottom: 10,
        borderBottomColor: 'black'
    },
    cancelText: {
        fontWeight: 'bold',
    },
    loginHeader: {
        fontWeight: 'bold',
        marginBottom: 20
    },
    emailInput: {
        width: 250,
        marginVertical: 10,
        padding: 5,
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 3
    },
    loginButton: {
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5
    },
    loginButtonText: {
        color: 'white'
    },
    signUpButton: {
        backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5
    }
});