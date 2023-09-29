import axios from "axios";
import config from "./config";
import { setFlightDeals } from "./local/getSetFlights";

export default async function downloadFlightDeals(data) {
  for (let i in data) {
    const res = await axios.get(`https://app.salesap.ru/api/v1/deals/${data[i]}?include=deals`, config).catch((e) => setLogsData({ data: e.data?.message, type: "Get Flight Deals", status: "error" }))
    console.log("Count:", res.data?.included?.length)
    if (res.data?.included?.length) {
      setFlightDeals(res.data?.included.map(e => ({ data: e })));
    }
    await new Promise(r => setTimeout(r, 1000))
  }
  return true;
} 