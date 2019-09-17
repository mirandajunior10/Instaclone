import react from 'react'
import { f, storage, database } from '../config/config';


function S4() {
    return Math.floor(1 + Math.random() * 0x10000).toString(16).substring(1);
}

function uniqueID() {
    return S4() + S4() + '-' + S4() + '-' + S4() + '-' +
        S4() + '-' + S4() + '-' + S4() + '-' + S4();
}
export async function uploadImage(uri) {

    var userID = f.auth().currentUser.uid;
    var imageID = this.state.imageID;

    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(uri)[1];
    setCurrentFileType(ext);
    setUploading(true);

    const response = await fetch(uri);
    const blob = await response.blob();
    var FilePath = uniqueID() + "." + currentFileType;

    var uploadTask = storage.ref('user/' + userID + '/post').child(FilePath).put(blob);
    uploadTask.snapshot();
    uploadTask.on('state_changed', snapshot => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes * 100).toFixed(0);
        console.log('Uplopad is ' + progress + '% complete');
        setProgress(progress);
    }, error => {
        console.log('Error with upload -', error);
    }, async () => {
        setProgress(100);
        try {
            const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
            console.log(downloadURL);
            processUpload(downloadURL);
        } catch (error) {
            console.log(error)
        }

    });


}

export async function processUpload(imageURL) {
    //Process here...

    var userID = f.auth().currentUser.uid;
    var date = Date.now();
    //var caption = this.state.caption;
    var timestamp = Math.floor(date / 1000);
    //var imageID = this.state.imageID;

    //Build photo object
    //author, caption, posted,url

    var photoObj = {
        author: userID,
        caption: caption,
        posted: timestamp,
        uri: imageResponse
    };
    //Update database

    //Add to main feed
    database.ref('/photos/' + imageID).set(photoObj);

    //Set user photos object
    var ref = '/users/' + userID + '/photos/' + imageID;
    console.log(ref)
    database.ref('/users/' + userID + '/photos/' + imageID).set(photoObj);

    alert('Image uploaded');

}

export async function uploadSmallImage(photo) {
    console.log("iniciando upload de small");
    var userID = photo.author;
    var imageID = uniqueID();

    console.log(photo);

    var re = /(?:\.([^.]+))?$/;
    var ext = 'jpg';
    console.log("extension", ext);
    setCurrentFileType(ext);
    setUploading(true);
    const response = await fetch(photo.uri);
    console.log("response", response);
    const blob = await response.blob();
    console.log(blob);
    var FilePath = imageID + "." + ext;

    console.log("Filepath", FilePath);
    var uploadTask = storage.ref('user/' + userID + '/small').child(FilePath).put(blob);
    uploadTask.on('state_changed', snapshot => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes * 100).toFixed(0);
        console.log('Uplopad is ' + progress + '% complete');

    }, error => {
        console.log('Error with upload -', error);
    }, async () => {
        setProgress(100);


        try {
            const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
            console.log(downloadURL);
            processUpload(downloadURL);
        } catch (error) {
            console.log(error)
        }

    });


}

export function uploadPublish() {
    if (!uploading) {
        if (caption != '') {
            uploadImage(imageResponse);
            //this.setState({uploading: false});
        } else {
            alert('please enter a caption...');
        }
    } else {
        console.log('Ignore button tap as already uploading')
    }
}