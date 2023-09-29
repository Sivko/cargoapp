import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getInvocesData() {
  try {
    const res = await AsyncStorage.getItem('invoces') ?? []
    return JSON.parse(res)
  } catch (err) {
    console.log(err)
  }
}

export async function setInvocesData(data) {
  try {
    const res = await AsyncStorage.setItem('invoces', JSON.stringify(data));
    const dataM = await getInvocesData()
    console.log("data", dataM)
    return res
  } catch (err) {
    console.log(err)
  }
}



export async function getInvocesToUploadData() {
  try {
    const res = await AsyncStorage.getItem('invoceToUpload') || "[]"
    // console.log(res, "res")
    return JSON.parse(res)
  } catch (err) {
    console.log(err)
  }
}

export async function setInvocesToUploadData(data) {
  try {
    const invoces = await getInvocesToUploadData();
    await AsyncStorage.setItem('invoceToUpload', JSON.stringify([data, ...invoces]));
    // console.log("dataToUpload", dataM)
  } catch (err) {
    console.log(err)
  }
}

export async function hardSetInvocesToUploadData(data) {
  try {
    const invoces = await getInvocesToUploadData();
    await AsyncStorage.setItem('invoceToUpload', JSON.stringify([...data]));
    // await AsyncStorage.setItem('invoceToUpload', JSON.stringify([]));
    // console.log("dataToUpload", dataM)
  } catch (err) {
    console.log(err)
  }
}

