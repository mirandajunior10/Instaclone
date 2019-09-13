import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import LazyImage from '../../Components/LazyImage';
import {f, auth, database} from '../../config/config';
import { Post, Header, Avatar, Name, Description, Loading } from './styles';
import { formatDistanceToNow } from 'date-fns';
import Auth from '../auth/auth';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';



export default function pages() {

    const
        [
            feed,
            setFeed
        ] = useState([]),
        [
            page,
            setPage
        ] = useState(1),
        [
            total,
            setTotal
        ] = useState(),
        [
            viewable,
            setViewable
        ] = useState([]),
        [
            loading,
            setLoading
        ] = useState(false),
        [
            refreshing,
            setRefreshing
        ] = useState(false),
        [
            loggedIn,
            setLoggedIn
        ] = useState(false),
        [
            empty,
            setEmpty
        ] = useState(false);


    async function signOut() {
        GoogleSignin.configure({
            webClientId: "390298799165-ol7dog0ng54ijfeakgkn58dp0dt1ivte.apps.googleusercontent.com",
            offlineAccess: true

        });

        if (auth.currentUser) {
            await auth.signOut();
            await GoogleSignin.signOut();
            setLoggedIn(false);
        }
        else {
            alert("Already logged out!");
        }

    }

    async function onLoginOrRegister() {
        try {

            // Add any configuration settings here:
            GoogleSignin.configure({
                webClientId: "390298799165-ol7dog0ng54ijfeakgkn58dp0dt1ivte.apps.googleusercontent.com",
                offlineAccess: true,


            });
            const data = await GoogleSignin.signIn();


            if (data) {
                console.log(data)
                console.log(data.accessToken);
                // create a new firebase credential with the token
                const credential = f.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
                console.log(credential);
                // login with credential
                const currentUser = await auth.signInWithCredential(credential);
                console.log(currentUser);

                if (currentUser.additionalUserInfo.isNewUser) {
                    var uObj = {
                        name: currentUser.additionalUserInfo.profile.name,
                        //username: `@${}`,
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

    async function addToFlatList(feed, data) {

        for (var photo in data) {
            //guarda em photoObj, o objeto com o nome da variável photo no array data
            var photoObj = data[photo];
            //depois de obtida a foto, o próximo try é feito para buscar as informações do usuário que o app mostrará na tela
            try {
                let usernameSnapshot = await database.ref('users').child(photoObj.author).child('username').once('value');
                var username = usernameSnapshot.val();

                let avatarSnapshot = await database.ref('users').child(photoObj.author).child('avatar').once('value');
                var avatar = avatarSnapshot.val();
                const exists = (username != null);
                var user = {};
                if (exists) {
                    user = {
                        username,
                        avatar
                    }
                    console.log(user);
                }
                //mostra no console as informações de cada objeto --Dev only :)
                //console.log(photo);

                feed.push({
                    id: photo,
                    url: photoObj.uri,
                    caption: photoObj.caption,
                    posted: formatDistanceToNow(new Date(photoObj.posted * 1000), {
                        includeSeconds: true,
                        //locale: ptBR,
                        addSuffix: true
                    }),
                    timestamp: photoObj.posted,
                    author: user,
                    authorID: photoObj.author
                });



            } catch (error) {

                console.log(error);
            }
        }


        //return myData;
    }

    async function loadPage(pageNumber = page, shouldRefresh = false, userID = '') {

        //define o state pra loading: true e esvazia o vetor feed
        setLoading(true);
        if (shouldRefresh) {
            feed.length = 0;
        }
        //setFeed([]);
        //guarda o escopo da função, para atualizar o state mais tarde
        //var that = this;
        try {
            //totalItems = response.headers.get('X-Total-Count');
            //data = await response.json();
            var loadRef = database.ref('photos');
            if (userID != '') {
                loadRef = database.ref('users').child(userID).child('photos');
            }
            const snapshot = await loadRef.orderByChild('posted').once('value');
            //console.log('atualizar feed', shouldRefresh);
            //console.log(snapshot.val());


            //console.log("feed", feed);
            const exists = (snapshot.val() != null);
            if (exists) {
                setEmpty(false);
                data = snapshot.val()
                //atualiza o state usando a variável that
                //var photos = feed;

                await addToFlatList(feed, data);
                //console.log(feed);

            } else {
                setEmpty(true);
            }

            setLoading(false);
            //setTotal(Math.floor(totalItems / 4));
            setPage(pageNumber + 1);

            setFeed([].concat(feed).sort((a, b) => a.timestamp < b.timestamp));
            console.log(feed);
            //await onLoginOrRegister();
            console.log(feed);

        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                //Logged in
                console.log(user);
                setLoggedIn(true);
            } else {
                //not logged in
                setLoggedIn(false);

            }
        });
        loadPage();

    }, []);

    async function refreshList() {

        setRefreshing(true);


        await loadPage(1, true);

        setRefreshing(false);

    }

    // const handleViewableChanged = useCallback(({ changed }) => {

    //     setViewable(changed.map(({ item }) => item.id));

    // }, []);

    return (
        //     <View style={{margin: 100}}>
        //    <GoogleLogin/>
        //    </View>

        <View >
            {loggedIn ? (
                <View>
                    <Text>You are logged in</Text>
                    <GoogleSigninButton
                        style={{ width: 192, height: 48 }}
                        size={GoogleSigninButton.Size.Wide}
                        color={GoogleSigninButton.Color.Dark}
                        onPress={signOut}
                        disabled={false} />
               

                    <FlatList
                        data={feed}
                        keyExtractor={(item, index) => index.toString()}
                        onEndReachedThreshold={0.1}
                        onEndReached={() => loadPage()}
                        onRefresh={refreshList}
                        refreshing={refreshing}
                        //onViewableItemsChanged={handleViewableChanged}
                        viewabilityConfig={{ "viewAreaCoveragePercentThreshold": 20 }}
                        ListFooterComponent={loading && <Loading />}
                        renderItem={({ item }) =>
                            <Post>
                                <Header>
                                    <Avatar source={{ "uri": item.author.avatar }} />
                                    <Name>{item.author.username}</Name>
                                </Header>
                                <LazyImage
                                    shouldLoad={viewable.includes(item.id)}
                                    aspectRatio={100}
                                    source={{ "uri": item.url }}
                                // smallSource={{ "uri": item.small }}
                                />
                                <Description>
                                    <Name>{item.author.username}</Name> {item.caption}
                                </Description>
                            </Post>
                        } />
                </View>

            ) : (

                    <Auth message={'Please log in to do something'}/>
                )}



        </View>
    );

}


const styles = StyleSheet.create({
    view: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

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