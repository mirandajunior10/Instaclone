import React from 'react';
//import ImagePicker from 'react-native-image-picker';


export default async function postPreview() {

    var file = null;

    // async function checkPermissions() {
    //     console.log("checando permissão");
    //     const status = await Permissions.askAsync(Permissions.CAMERA);
    //     this.setState({ camera: status });
    //     console.log(status);

    //     const statusRoll = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    //     this.setState({ cameraRoll: statusRoll });
    //     console.log(statusRoll);

    // }





    // });
    file = findNewImage();
    return file;
}
