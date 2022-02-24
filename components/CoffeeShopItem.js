import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

const Container = styled.View`
    width: 100%;
    flex-direction: column;
    margin-bottom: 30px;
`;

const Thumbnail = styled.Image`
    width: 100%;
    height: 250px;
    background-color: yellow;
`;

const Title = styled.View`
    width: 100%;
    height: 50px;
    flex-direction: row;
    margin-top: 8px;
    padding: 10px;
`;

const UserProfile = styled.View`
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
`;

const UserAvatar = styled.Image`
    width: 30px;
    height: 30px;
    background-color: yellow;
    border-radius: 15px;
`;
const UserName = styled.Text`
    color: white;
    font-size: 11px;
`;

const CoffeeShopName = styled.Text`
    color: white;
    font-size: 20px;
    font-weight: 600;
`;

const CategoryContainer = styled.View`
    flex-direction: row;
    margin: 10px;
`;
const Category = styled.Text`
    border: 1px solid yellow;
    border-radius: 3px;
    color: white;
    padding: 3px;
    margin-right: 10px;
`;

export const defaultCafeImage =
    'https://images.unsplash.com/photo-1532490389938-2856e3f1560a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80';
export const defaultAvatar =
    'https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2062&q=80';

function CoffeeShopItem({ photo, categories, user, name }) {
    return (
        <Container>
            <Thumbnail source={{ uri: photo?.url || defaultCafeImage }} resizeMode="cover" />
            <Title>
                <UserProfile>
                    <UserAvatar source={{ uri: user?.avatarURL || defaultAvatar }} resizeMode="cover" />
                    <UserName>{user?.username}</UserName>
                </UserProfile>
                <CoffeeShopName>{name}</CoffeeShopName>
            </Title>
            <CategoryContainer>
                {categories.map(({ id, name }) => (
                    <Category key={id}>{name}</Category>
                ))}
            </CategoryContainer>
        </Container>
    );
}

export default CoffeeShopItem;

CoffeeShopItem.propTypes = {
    photo: PropTypes.shape({
        url: PropTypes.string,
    }),
    categories: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
        })
    ),
    name: PropTypes.string.isRequired,
    user: PropTypes.shape({
        username: PropTypes.string.isRequired,
        avatarURL: PropTypes.string,
    }),
};
