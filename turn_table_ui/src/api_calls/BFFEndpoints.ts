// All endpoints for the BFF are defined in this file

let bff = import.meta.env.VITE_BFF_ADDRESS;
// If the bff doesnt begin with http, add it
if (!bff.startsWith("http")) {
	bff = `http://${bff}`;
}

// Order is alphabetical
export const addAlbum = `${bff}/user/add_album`;
export const albumDetails = `${bff}/music/album_details`;
export const auth = `${bff}/auth/token`;
export const BFFWebSocket = `ws://${bff}/ws`;
export const createUser = `${bff}/user/create_user`;
export const deleteUser = `${bff}/user/`;
export const getIsCollectionPublic = `${bff}/user/is_collection_public`;
export const getNotifications = `${bff}/user/get_notifications`;
export const getPublicCollections = `${bff}/social/get_public_collections`;
export const getSharedCollections = `${bff}/social/get_shared_collections`;
export const getUserAlbums = `${bff}/user/get_user_albums`;
export const getUsersBySearch = `${bff}/user/search`;
export const imageToAlbum = `${bff}/image_search/image_to_album/`;
export const playTrack = `${bff}/music/play_track/`;
export const shareCollection = `${bff}/social/share_collection/`;
export const toggleCollectionPublic = `${bff}/social/toggle_collection_public`;
export const userInfo = `${bff}/user/get_user_info`;
