import styled from 'styled-components/native';


//consertar aspect-ratio para aspect-ratio: ${(props) => props.ratio} após correções na database
export const Small = styled.ImageBackground`
    width:100%;
    aspect-ratio:100%;
`;
export const Original = styled.Image`
    width:100%;
    height:500px;
    resize-mode: cover
    
`;
