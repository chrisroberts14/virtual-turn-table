// All endpoints for the BFF are defined in this file

export const albumDetails = `https://${import.meta.env.VITE_BFF_ADDRESS}/music/album_details`;
export const userInfo = `https://${import.meta.env.VITE_BFF_ADDRESS}/user/get_user_info`;
export const imageToAlbum = `https://${import.meta.env.VITE_BFF_ADDRESS}/image_search/image_to_album/`;
export const playTrack = `https://${import.meta.env.VITE_BFF_ADDRESS}/music/play_track/`;
export const createUser = `https://${import.meta.env.VITE_BFF_ADDRESS}/user/create_user`;
export const addAlbum = `https://${import.meta.env.VITE_BFF_ADDRESS}/user/add_album/`;
export const getUserAlbums = `https://${import.meta.env.VITE_BFF_ADDRESS}/user/get_user_albums`;
export const getPublicCollections = `https://${import.meta.env.VITE_BFF_ADDRESS}/social/get_public_collections`;
export const getSharedCollections = `https://${import.meta.env.VITE_BFF_ADDRESS}/social/get_shared_collections`;
export const shareCollection = `https://${import.meta.env.VITE_BFF_ADDRESS}/social/share_collection/`;
export const toggleCollectionPublic = `https://${import.meta.env.VITE_BFF_ADDRESS}/social/toggle_collection_public`;
export const getIsCollectionPublic = `https://${import.meta.env.VITE_BFF_ADDRESS}/user/is_collection_public`;
export const deleteUser = `https://${import.meta.env.VITE_BFF_ADDRESS}/user/`;
export const getUsersBySearch = `https://${import.meta.env.VITE_BFF_ADDRESS}/user/search`;
export const BFFWebSocket = `ws//${import.meta.env.VITE_BFF_ADDRESS}/social/ws`;
export const getNotifications = `https://${import.meta.env.VITE_BFF_ADDRESS}/user/get_notifications`;
