import axios from "axios";

import config from "@/requests/config";

export default async function downloadFlights(user) {
  const url =
    "https://app.salesap.ru/api/v1/deals?filter[deal-stage-id]=336300?include=deals"; /* сделки на этапе "предварительная загрузка" */
  const res = await axios.get(url, config(user?.token));
  return res;
}
