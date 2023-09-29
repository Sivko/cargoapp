import axios from "axios";
import config from "./config";

// const url = "https://app.salesap.ru/api/v1/deals?filter[stage_category]=51231"
const url = "https://app.salesap.ru/api/v1/deals?filter[stage]=327693" /* рейс завершен */


export async function getFlights() {
  const res = await axios.get(url, config);
  return res?.data?.data;
}
