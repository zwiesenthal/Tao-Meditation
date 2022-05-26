import AsyncStorage from '@react-native-community/async-storage';

export const setSettings = async (settings) => {
    await asyncSet('settings', JSON.stringify(settings));
}

export const getSettings = async () => {
    var settings = await asyncGet('settings');
    return JSON.parse(settings);
}

export const asyncSet = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        console.log(error);
    }
}

export const asyncGet = async (key) => {
    try {
        return await AsyncStorage.getItem(key);
    } catch (error) {
        console.log(error);
    }
}
