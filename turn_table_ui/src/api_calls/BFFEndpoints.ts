// All endpoints for the BFF are defined in this file

export const albumDetails = `http://${import.meta.env.VITE_BFF_ADDRESS}/music/album_details`;
export const userInfo = `http://${import.meta.env.VITE_BFF_ADDRESS}/user/get_user_info`;
export const imageToAlbum = `http://${import.meta.env.VITE_BFF_ADDRESS}/image_search/image_to_album/`;
export const playTrack = `http://${import.meta.env.VITE_BFF_ADDRESS}/music/play_track/`;
export const createUser = `http://${import.meta.env.VITE_BFF_ADDRESS}/user/create_user`;
export const addAlbum = `http://${import.meta.env.VITE_BFF_ADDRESS}/user/add_album/`;
export const getUserAlbums = `http://${import.meta.env.VITE_BFF_ADDRESS}/user/get_user_albums`;
export const getPublicCollections = `http://${import.meta.env.VITE_BFF_ADDRESS}/social/get_public_collections`;
export const getSharedCollections = `http://${import.meta.env.VITE_BFF_ADDRESS}/social/get_shared_collections`;
export const shareCollection = `http://${import.meta.env.VITE_BFF_ADDRESS}/social/share_collection/`;
export const toggleCollectionPublic = `http://${import.meta.env.VITE_BFF_ADDRESS}/social/toggle_collection_public`;
export const getIsCollectionPublic = `http://${import.meta.env.VITE_BFF_ADDRESS}/user/is_collection_public`;
export const deleteUser = `http://${import.meta.env.VITE_BFF_ADDRESS}/user/`;
export const getUsersBySearch = `http://${import.meta.env.VITE_BFF_ADDRESS}/user/search`;
export const BFFWebSocket = `ws://${import.meta.env.VITE_BFF_ADDRESS}/social/ws`;
export const getNotifications = `http://${import.meta.env.VITE_BFF_ADDRESS}/user/get_notifications`;
