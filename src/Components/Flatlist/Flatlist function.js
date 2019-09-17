 // async addToFlatList(feed, data) {

    //     for (var photo in data) {
    //         //guarda em photoObj, o objeto com o nome da variável photo no array data
    //         var photoObj = data[photo];
    //         //console.log(photoObj);
    //         //depois de obtida a foto, o próximo try é feito para buscar as informações do usuário que o app mostrará na tela
    //         try {
    //             let usernameSnapshot = await database.ref('users').child(photoObj.author).child('username').once('value');
    //             var username = usernameSnapshot.val();

    //             let avatarSnapshot = await database.ref('users').child(photoObj.author).child('avatar').once('value');
    //             var avatar = avatarSnapshot.val();
    //             const exists = (username != null);
    //             var user = {};
    //             if (exists) {
    //                 user = {
    //                     username,
    //                     avatar
    //                 }
    //                 //console.log(user);
    //             }
    //             //uploadSmallImage(photoObj);
    //             //console.log("chegou aqui")
    //             var imgWidth, imgHeight;
    //             var imagem = await Image.getSize(photoObj.uri, (width, height) => {
    //                 //  console.log("largura", width);
    //                 imgWidth = width;
    //                 // console.log("altura", height);
    //                 imgHeight = height;

    //             },
    //                 (error) => {
    //                     console.log(error);
    //                 });
    //             //mostra no console as informações de cada objeto --Dev only :)
    //             //console.log(photo);

    //             feed.push({
    //                 id: photo,
    //                 url: photoObj.uri,
    //                 caption: photoObj.caption,
    //                 posted: formatDistanceToNow(new Date(photoObj.posted * 1000), {
    //                     includeSeconds: true,
    //                     //locale: ptBR,
    //                     addSuffix: true
    //                 }),
    //                 timestamp: photoObj.posted,
    //                 author: user,
    //                 authorID: photoObj.author,
    //                 ratio: imgWidth / imgHeight
    //             });


    //             //console.log("imagem", imagem);

    //         } catch (error) {

    //             console.log(error);
    //         }
    //     }


    //     //return myData;
    // }


    // async loadPage(pageNumber = page, shouldRefresh = false, userID = '') {

    //     //define o state pra loading: true e esvazia o vetor feed
    //     this.setState({ loading: true });

    //     if (shouldRefresh) {
    //         feed.length = 0;
    //     }
    //     //setFeed([]);
    //     //guarda o escopo da função, para atualizar o state mais tarde
    //     try {
    //         //totalItems = response.headers.get('X-Total-Count');
    //         //data = await response.json();
    //         var loadRef = database.ref('photos');
    //         if (userID != '') {
    //             loadRef = database.ref('users').child(userID).child('photos');
    //         }
    //         const snapshot = await loadRef.orderByChild('posted').once('value');
    //         //console.log('atualizar feed', shouldRefresh);
    //         //console.log(snapshot.val());


    //         //console.log("feed", feed);
    //         const exists = (snapshot.val() != null);
    //         if (exists) {

    //             this.setState({ empty: false });
    //             data = snapshot.val()
    //             //var photos = feed;

    //             await addToFlatList(feed, data);
    //             //console.log(feed);

    //         } else {
    //             setEmpty(true);
    //             this.setState({ empty: true });
    //         }
    //         this.setState({
    //             loading:true,
    //             page: pageNumber + 1,
    //             feed: [].concat(feed).sort((a, b) => a.timestamp < b.timestamp)
    //         });

    //     } catch (error) {
    //         console.log(error);
    //     }

    // }
