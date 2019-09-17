import react, { StyleSheet } from 'react-native'

export default styles = StyleSheet.create({
    view: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },
    caption_textInput: {
        marginVertical: 10,
        height: 100,
        padding: 5,
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 3,
        backgroundColor: 'white',
        color: 'black'
    },
    loginView: {
        flexDirection: 'row',
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
    select_photo_button: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: 'blue',
        borderRadius: 5
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
    },
    upload_button_text: {
        textAlign: 'center',
        color: 'white'
    },
    imagePreview: {
        marginTop: 10,
        resizeMode: 'cover',
        width: '100%',
        height: 275
    }
});