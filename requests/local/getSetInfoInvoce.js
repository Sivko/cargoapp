import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getInvoceInfo() {
  try {
    const res = await AsyncStorage.getItem('invoceInfo') ?? {}
    return JSON.parse(res)
  } catch (err) {
    console.log(err)
  }
}

export async function setInvoceInfo(data) {
  try {
    const res = await AsyncStorage.setItem('invoceInfo', JSON.stringify(data));
    return res
  } catch (err) {
    console.log(err)
  }
}