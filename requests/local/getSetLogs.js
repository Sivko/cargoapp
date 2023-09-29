import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getLogsData() {
  try {
    const res = await AsyncStorage.getItem('logs') ?? "[]"
    return JSON.parse(res)
  } catch (err) {
    console.log(err)
  }
}

export async function setLogsData({ type, status }) {
  try {
    const logs = await getLogsData();
    const log = {
      date: new Date(),
      type,
      status
    }
    const res = await AsyncStorage.setItem('logs', JSON.stringify([log, ...logs]));
    return res
  } catch (err) {
    console.log(err)
  }
}

export async function removeLogsData() {
  try {
    const res = await AsyncStorage.setItem('logs', JSON.stringify([]));
    return res
  } catch (err) {
    console.log(err)
  }
}