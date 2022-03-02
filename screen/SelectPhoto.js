import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import styled from 'styled-components/native';
import { FlatList, Image, TouchableOpacity, useWindowDimensions, StatusBar } from 'react-native';
import { palette } from '../palette';

const Container = styled.View`
    flex: 1;
    background-color: black;
`;
const Bottom = styled.View`
    flex: 2;
    background-color: black;
`;
const ImageContainer = styled.TouchableOpacity``;
const IconContainer = styled.View`
    position: absolute;
    bottom: 5px;
    right: 0px;
`;
const HeaderRightText = styled.Text`
    color: ${palette.blue};
    font-size: 16px;
    font-weight: 600;
    margin-right: 7px;
`;

export default function SelectPhoto({ navigation }) {
    const [ok, setOk] = useState(false);
    const [photos, setPhotos] = useState([]);
    const [selectedPhotos, setSelectedPhotos] = useState([]);

    const getPhotos = async () => {
        const { assets: photos } = await MediaLibrary.getAssetsAsync();
        setPhotos(photos);
        photos[0]?.uri && setSelectedPhotos([{ uri: photos[0]?.uri }]);
    };
    const getPermissions = async () => {
        const { granted, canAskAgain } = await MediaLibrary.getPermissionsAsync();
        if (!granted && canAskAgain) {
            const { granted } = await MediaLibrary.requestPermissionsAsync();
            if (granted !== 'none') {
                setOk(true);
                getPhotos();
            }
        } else if (granted !== 'none') {
            setOk(true);
            getPhotos();
        }
    };
    const HeaderRight = () => (
        <TouchableOpacity
            onPress={() =>
                navigation.navigate('UploadForm', {
                    files: selectedPhotos,
                })
            }
        >
            <HeaderRightText>Next</HeaderRightText>
        </TouchableOpacity>
    );
    useEffect(() => {
        getPermissions();
    }, [ok]);
    const selectPhoto = (uri) => {
        const selectedPhoto = selectedPhotos.find((photo) => photo.uri === uri);
        if (selectedPhoto) {
            setSelectedPhotos((selectedPhotos) => selectedPhotos.filter((selectedPhoto) => selectedPhoto.uri !== uri));
        } else {
            setSelectedPhotos((selectedPhotos) => [...selectedPhotos, { uri }]);
        }
    };
    useEffect(() => {
        navigation.setOptions({
            headerRight: HeaderRight,
        });
    }, [selectPhoto]);

    const numColumns = 4;
    const { width } = useWindowDimensions();

    const renderItem = ({ item: photo }) => (
        <ImageContainer onPress={() => selectPhoto(photo.uri)}>
            <Image source={{ uri: photo.uri }} style={{ width: width / numColumns, height: 100 }} />
            <IconContainer>
                <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color={
                        selectedPhotos.find((selectedPhoto) => selectedPhoto.uri === photo.uri) ? palette.blue : 'white'
                    }
                />
            </IconContainer>
        </ImageContainer>
    );

    return (
        <Container>
            <StatusBar hidden={false} />
            <Bottom>
                <FlatList
                    data={photos}
                    numColumns={numColumns}
                    keyExtractor={(photo) => photo.id}
                    renderItem={renderItem}
                />
            </Bottom>
        </Container>
    );
}
