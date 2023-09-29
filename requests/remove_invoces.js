import axios from "axios"
import config from "./config"

const url = "https://app.salesap.ru/api/v1/deals?filter[stage_category]=51230"


export async function getInvoces() {
  const res = await axios.get(url, config);
  return res?.data?.data;
}