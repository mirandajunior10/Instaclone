import React, { useState, useEffect } from 'react';
import { Small, Original } from './styles'
import { Animated } from 'react-native';

const OriginalAnimated = Animated.createAnimatedComponent(Original)
// import { Container } from './styles';

export default function LazyImage({
    smallSource,
    source,
    aspectRatio,
    shouldLoad,
}) {
    const opacity = new Animated.Value(0);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if(shouldLoad){
            // setTimeout(() => {
                setLoaded(true);
            // }, 1000);
        }
        
    }, [shouldLoad])
    function handleAnimate() {
        Animated.timing(opacity,{
            toValue:1,
            duration:500,
            useNativeDriver: true,
        }).start();
    }
    return (
        <Small
            blurRadius={1}
            source={smallSource}
            ratio={aspectRatio}
            resizeMode='contain' >

            {
                loaded &&
                <OriginalAnimated
                    style={{opacity}}
                    source={source}
                    onLoadEnd={handleAnimate}
                    ratio={aspectRatio}
                    resizeMode='contain'
                />
            }
        </Small>
    );
}
