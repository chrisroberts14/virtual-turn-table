// All endpoints for the BFF are defined in this file

export const albumDetails = `${import.meta.env.VITE_BFF_ADDRESS}/music/album_details`;
export const userInfo = `${import.meta.env.VITE_BFF_ADDRESS}/user/get_user_info`;
export const imageToAlbum = `${import.meta.env.VITE_BFF_ADDRESS}/image_search/image_to_album/`;
export const playTrack = `${import.meta.env.VITE_BFF_ADDRESS}/music/play_track/`;
export const createUser = `${import.meta.env.VITE_BFF_ADDRESS}/user/create_user`;
export const addAlbum = `${import.meta.env.VITE_BFF_ADDRESS}/user/add_album/`;
export const getUserAlbums = `${import.meta.env.VITE_BFF_ADDRESS}/user/get_user_albums`;
export const getPublicCollections = `${import.meta.env.VITE_BFF_ADDRESS}/social/get_public_collections`;
export const getSharedCollections = `${import.meta.env.VITE_BFF_ADDRESS}/social/get_shared_collections`;
export const shareCollection = `${import.meta.env.VITE_BFF_ADDRESS}/social/share_collection/`;
export const toggleCollectionPublic = `${import.meta.env.VITE_BFF_ADDRESS}/social/toggle_collection_public`;
export const getIsCollectionPublic = `${import.meta.env.VITE_BFF_ADDRESS}/user/is_collection_public`;
