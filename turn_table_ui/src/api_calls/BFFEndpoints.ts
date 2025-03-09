// All endpoints for the BFF are defined in this file

let bff = import.meta.env.VITE_BFF_ADDRESS
	? import.meta.env.VITE_BFF_ADDRESS
	: "http://localhost:8000";
// If the bff doesnt begin with http, add it
if (!bff.startsWith("http")) {
	bff = `http://${bff}`;
}

let websocket = bff;
if (bff.startsWith("http://")) {
	websocket = bff.replace("http", "ws");
} else if (bff.startsWith("https://")) {
	websocket = bff.replace("https", "wss");
} else {
	console.error("Unknown protocol for BFF address");
}

// Order is alphabetical
export const addAlbum = `http://${bff}/user/add_album`;
export const albumDetails = `http://${bff}/music/album_details`;
export const auth = `http://${bff}/auth/token`;
export const BFFWebSocket = `ws://${bff}/ws`;
export const createUser = `http://${bff}/user/create_user`;
export const deleteUser = `http://${bff}/user/`;
export const getIsCollectionPublic = `http://${bff}/user/is_collection_public`;
export const getNotifications = `http://${bff}/user/get_notifications`;
export const getPublicCollections = `http://${bff}/social/get_public_collections`;
export const getSharedCollections = `http://${bff}/social/get_shared_collections`;
export const getUserAlbums = `http://${bff}/user/get_user_albums`;
export const getUsersBySearch = `http://${bff}/user/search`;
export const imageToAlbum = `http://${bff}/image_search/image_to_album/`;
export const playTrack = `http://${bff}/music/play_track/`;
export const shareCollection = `http://${bff}/social/share_collection`;
export const toggleCollectionPublic = `http://${bff}/social/toggle_collection_public`;
export const userInfo = `http://${bff}/user/get_user_info`;
