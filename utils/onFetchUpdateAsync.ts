import * as Updates from 'expo-updates'
export async function onFetchUpdateAsync() {
    try {
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
            alert('New update available, downloading.')
            await Updates.fetchUpdateAsync();
            await Updates.reloadAsync();
        }
    } catch (error) {
        // You can also add an alert() to see the error message in case of an error when fetching updates.
        alert(`Error fetching latest Expo update: ${error}`);
    }
}

