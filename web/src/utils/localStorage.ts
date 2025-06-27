
export const setLocalStorageItem = (key: string, value: string) => {
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        console.error(`Error setting localStorage item ${key}:`, error);
    }
};

export const getLocalStorageItem = (key: string): string | null => {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.error(`Error getting localStorage item ${key}:`, error);
        return null;
    }
};
