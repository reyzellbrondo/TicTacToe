const storage = window.localStorage 


export const getStorageData = (storageName) => {

    let storageData = storage.getItem(storageName)
    storageData = JSON.parse(storageData)
    return storageData;

}

export const uploadStageData = (storageName,data) => {

   let storageData = storage.getItem(storageName)
   storageData = JSON.parse(storageData)
   storageData.push(data)
   storageData = JSON.stringify(storageData)
   storage.setItem(storageName,storageData)


}