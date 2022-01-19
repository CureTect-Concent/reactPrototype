import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_TOKEN_KEY = "@LoginTokenInFo";
const STORAGE_ROOM_NAME_KEY = "@RoomName";
const STORAGE_KEYBOARD_HEIGHT_KEY = "@KeyboardHeight";

export default class dataManager {
  static async setValueForKeyBoardHeight(value) {
    await AsyncStorage.setItem(STORAGE_KEYBOARD_HEIGHT_KEY, value);
  }
  static async getValueForKeyBoardHeight() {
    return await AsyncStorage.getItem(STORAGE_KEYBOARD_HEIGHT_KEY);
  }
  static async setRoomName(value) {
    await AsyncStorage.setItem(STORAGE_ROOM_NAME_KEY, value);
  }
  static async getRoomName() {
    return await AsyncStorage.getItem(STORAGE_ROOM_NAME_KEY);
  }
  static async setValueForIdToken(value) {
    await AsyncStorage.setItem(STORAGE_TOKEN_KEY, value);
  }
  static async getValueForIdToken() {
    return await AsyncStorage.getItem(STORAGE_TOKEN_KEY);
  }
}
