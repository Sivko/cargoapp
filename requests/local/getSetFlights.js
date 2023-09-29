import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getFlightDeals() {
  try {
    const res = await AsyncStorage.getItem('flightDeals') ?? "[]"
    return JSON.parse(res)
  } catch (err) {
    console.log(err)
  }
}

export async function setFlightDeals(data = []) {
  try {
    const storage = await getFlightDeals()
    const res = await AsyncStorage.setItem('flightDeals', JSON.stringify([...data, ...storage]));
    return res
  } catch (err) {
    console.log(err)
  }
}

export async function removeFlightDeals() {
  try {
    const res = await AsyncStorage.setItem('flightDeals', JSON.stringify([]));
    return res
  } catch (err) {
    console.log(err)
  }
}
