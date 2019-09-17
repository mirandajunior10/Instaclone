import React from 'react';
import { View, FlatList, StyleSheet, Text, Image, PermissionsAndroid, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
//import LazyImage from '../../Components/LazyImage';
import { f, auth, database, storage } from '../../config/config';
//import { Post, Header, Avatar, Name, Description, Loading } from './styles';
//import { formatDistanceToNow } from 'date-fns';
import Auth from '../auth/auth';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import { webClientID } from '../../config/firebaseconfig';
//import postPreview from '../../Components/PostPreview';
import styles from '../../assets/styles';
//import { uploadPublish } from '../../insta_src/uploadFunctions';
import ImagePicker from 'react-native-image-picker';

export default class Pages extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            feed: [],
            page: 1,
            total: 0,
            viewable: [],
            loading: false,
            refreshing: false,
            loggedIn: false,
            empty: false,
            currentFileType: '',
            uploading: false,
            imageSelected: false,
            caption: '',
            imageID: '',
            progress: 0,
            imageResponse: null,
            imageURL: '',
            file: null,

        };
    }


    async signOut() {
        var that = this
        GoogleSignin.configure({
            webClientId: webClientID,
            offlineAccess: true

        });

        if (auth.currentUser) {
            await auth.signOut();
            await GoogleSignin.signOut();
            that.setState({ loggedIn: false })
        }
        else {
            alert("Already logged out!");
        }

    }

    async findNewImage() {
         var that = this;

        const options = {
            title: 'Select Avatar',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

         ImagePicker.launchImageLibrary(options, async response => {

            if (response.didCancel) {
                console.log('User cancelled image picker');
                return 1;
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
                return 2;
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                return 3;

            } else {
                //console.log("response", response.path);
                console.log("fowjfpwe");
                that.setState({file: response})
                //console.log("file", file);
                console.log("response", response);
                console.log(that.state.file);
                that.setState({
                    imageSelected: true,
                    imageURL: "file:" + that.state.file.path
                });
                console.log(that.state.imageURL);
                var imagem = await fetch(that.state.imageURL);
                console.log(imagem);
                

            }
        })
    }


    componentDidMount() {
        auth.onAuthStateChanged(user => {
            if (user) {
                //Logged in
                //console.log(user);
                this.setState({ loggedIn: true });
            } else {
                //not logged in
                this.setState({ loggedIn: false });

            }
        });

    }

    async refreshList() {

        this.setState({ refreshing: true });


        await this.loadPage(1, true);

        this.setState({ refreshing: false });

    }

    render() {
        return (

            <View>
                {this.state.loggedIn == true ? (
                    <View>
                        <Text>You are logged in</Text>
                        <GoogleSigninButton
                            style={{ width: 192, height: 48 }}
                            size={GoogleSigninButton.Size.Wide}
                            color={GoogleSigninButton.Color.Dark}
                            onPress={this.signOut}
                            disabled={false} />
                        {this.state.imageSelected == true ? (
                            //Check if an image is selected
                            <View style={{ flex: 1 }}>
                                <View style={{ padding: 5 }}>
                                    <Text style={{ marginTop: 5 }}>Caption</Text>
                                    <TextInput
                                        editable={true}
                                        placeholder={'Enter your caption...'}
                                        maxLength={150}
                                        multiline={true}
                                        numberOfLines={4}
                                        onChangeText={text => this.setState({ caption: text })}
                                        style={styles.caption_textInput} />

                                    <TouchableOpacity
                                        style={styles.upload_button}
                                        onPress={() => uploadPublish()}>
                                        <Text style={styles.upload_button_text}>Upload & publish</Text>
                                    </TouchableOpacity>
                                    {this.state.uploading == true ? (
                                        <View>
                                            <Text>{this.state.progress}%</Text>
                                            {this.state.progress != 100 ? (
                                                <ActivityIndicator size="small" color="blue" />
                                            ) : (
                                                    <Text>Processing</Text>
                                                )}
                                        </View>
                                    ) : (
                                            <View></View>
                                        )}
                                    <Image source={{ uri: this.state.imageURL }}
                                        style={styles.imagePreview} />


                                </View>
                            </View>
                        ) : (
                                <TouchableOpacity
                                    style={styles.select_photo_button}
                                    onPress={() => this.findNewImage()}>
                                    <Text style={styles.select_photo_text}>Select Photo</Text>
                                </TouchableOpacity>
                                // <FlatList
                                //     data={feed}
                                //     keyExtractor={(item, index) => index.toString()}
                                //     onEndReachedThreshold={0.1}
                                //     onEndReached={() => loadPage()}
                                //     onRefresh={refreshList}
                                //     refreshing={refreshing}
                                //     //onViewableItemsChanged={handleViewableChanged}
                                //     viewabilityConfig={{ "viewAreaCoveragePercentThreshold": 20 }}
                                //     ListFooterComponent={loading && <Loading />}
                                //     renderItem={({ item }) =>
                                //         <Post>
                                //             <Header>
                                //                 <Avatar source={{ "uri": item.author.avatar }} />
                                //                 <Name>{item.author.username}</Name>
                                //             </Header>
                                //             <LazyImage
                                //                 shouldLoad={viewable.includes(item.id)}
                                //                 aspectRatio={item.ratio}
                                //                 source={{ "uri": item.url }}
                                //             // smallSource={{ "uri": item.small }}
                                //             />
                                //             <Description>
                                //                 <Name>{item.author.username}</Name> {item.caption}
                                //             </Description>
                                //         </Post>
                                //     } />
                            )}


                    </View>

                ) : (

                        <Auth message={'Please log in to do something'} />
                    )}



            </View>

        )

    }
}
