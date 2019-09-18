import { f, storage, database } from '../config/config';
import Resizer from 'react-native-image-resizer';

function S4() {
    return Math.floor(1 + Math.random() * 0x10000).toString(16).substring(1);
}

export function uniqueID() {
    return S4() + S4() + '-' + S4() + '-' + S4() + '-' +
        S4() + '-' + S4() + '-' + S4() + '-' + S4();
}
export async function returnUploadImage(file, uniqueID) {

    var userID = f.auth().currentUser.uid;

    //console.log("user ID:", userID);
    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(file.path)[1];
    //console.log(ext);
    try {
        const response = await fetch(file.uri);
        //console.log("fetched file", response);

        const blob = await response.blob();
        console.log("blob", blob);

        var smallFilePath = uniqueID + '-small.' + ext;
        console.log("Small file path", smallFilePath);
        await uploadSmallImage(file, smallFilePath);
        return blob;
      

    } catch (error) {
        console.log(error);
    }



    // return uploadTask = storage.ref('user/' + userID + '/post').child(filePath).put(blob);

}

export async function processUpload(imageURL, caption, imageID) {
    //Process here...

    var userID = f.auth().currentUser.uid;
    var date = Date.now();
    var timestamp = Math.floor(date / 1000);

    //Build photo object
    //author, caption, posted,url



    var photoObj = {
        author: userID,
        caption: caption,
        posted: timestamp,
        uri: imageURL
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

async function uploadSmallImage(file, smallFilePath) {
    console.log("iniciando upload de small");

    var userID = f.auth().currentUser.uid;

    try {
        var newWidth = file.width / 10;
        var newHeight = file.height / 10;

        var resized = await Resizer.createResizedImage(
            file.uri,
            newWidth,
            newHeight,
            'JPEG',
            100,
            0,
            null
        );

        const response = await fetch(resized.uri);
       
        const blob = await response.blob();
            console.log("small file path", smallFilePath);
        var uploadTask = storage.ref('user/' + userID + '/small').child(smallFilePath).put(blob);
        uploadTask.on('state_changed', snapshot => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes * 100).toFixed(0);
            console.log('Upload is ' + progress + '% complete');

        }, error => {
            console.log('Error with upload -', error);
        }, async () => {
            try {

                const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                console.log("Small image upload complete, URL:", downloadURL);
            } catch (error) {
                console.log(error)
            }

        });
    } catch (error) {
        console.log(error);
    }
}