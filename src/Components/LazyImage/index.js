import React, {useState, useEffect} from 'react';
import {Small, Original} from './styles';
import {Animated} from 'react-native';

const OriginalAnimated = Animated.createAnimatedComponent(Original);
// Import { Container } from './styles';

export default function LazyImage ({
    smallSource,
    source,
    aspectRatio,
    shouldLoad
}) {

    const opacity = new Animated.Value(0),
        [
            loaded,
            setLoaded
        ] = useState(false);

    useEffect(() => {

        if (shouldLoad) {

            // SetTimeout(() => {
            setLoaded(true);
            // }, 1000);

        }

    }, [shouldLoad]);
    function handleAnimate () {

        Animated.timing(opacity, {
            "toValue": 1,
            "duration": 500,
            "useNativeDriver": true
        }).start();

    }

    return (
        // <Small
        //     blurRadius={1}
        //     source={smallSource}
        //     //ratio={aspectRatio}
        //     resizeMode="contain" >

            
              
                <OriginalAnimated
                    style={{opacity}}
                    source={source}
                    onLoadEnd={handleAnimate}
                    ratio={100}
                    resizeMode="contain"
                />
            
        // </Small>
    );

}
