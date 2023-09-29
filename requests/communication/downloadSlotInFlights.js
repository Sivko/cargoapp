// import scanStore from "@/stores/scanStore";

import axios from "axios";

import config, { stagesCategories, timeout } from "@/requests/config";

// const { idFlightsToDownloads } = scanStore();
export default async function downloadSlotInFlights({ idFlightsToDownloads, resetStoragescanItems, scanItems, setLoading, user }) {
  console.log(scanItems, "scanItems");
  setLoading(true);
  for (let i in idFlightsToDownloads) {
    const url = `https://app.salesap.ru/api/v1/deals/${idFlightsToDownloads[i]}?include=deals`;
    const res = await axios.get(url, config(user?.token));
    if (res.status == 404) continue;
    if (res.data?.included?.length) {
      // console.log("Сработала проверочка")
      let tmp = scanItems.filter((e) => e.flight.data.id === idFlightsToDownloads[i])[0];
      tmp.slots = [];
      const childrenDeals = res.data?.included.map(e => e.id)
      const childrenDeals2 = res.data?.included.map(e => ({ id: e.id, name: e.attributes.name }));
      for (let n in childrenDeals) {
        const getChildrenStage = await axios.get(`https://app.salesap.ru/api/v1/deals/${childrenDeals[n]}/relationships/stage-category`, config(user?.token));
        if (getChildrenStage.status != 200) continue;
        if (getChildrenStage.data.data.id === stagesCategories.invoice) {
          // console.log("Сработала проверочка 2", childrenDeals[n]);
          const getIncludesInInvoice = await axios.get(`https://app.salesap.ru/api/v1/deals/${childrenDeals[n]}?include=deals`, config(user?.token));
          const getIncludesInInvoiceId = getIncludesInInvoice.data?.included.map(e => e?.id);
          for (let x in getIncludesInInvoiceId) {
            const getStageIncludesInInvoice = await axios.get(`https://app.salesap.ru/api/v1/deals/${getIncludesInInvoiceId[x]}/relationships/stage-category`, config(user?.token));
            if (getStageIncludesInInvoice?.data?.data?.id === stagesCategories.slot) {
              // console.log("Сработала проверочка 3");
              const slotData = await axios.get(`https://app.salesap.ru/api/v1/deals/${getIncludesInInvoiceId[x]}`, config(user?.token));
              const _slotData = slotData.data.data;
              if (_slotData?.id) {
                if (!_slotData?.attributes["archived-at"] && !_slotData?.attributes["discarded-at"]) {
                  tmp.slots = [...tmp.slots, { data: { id: _slotData.id, type: 'deals', attributes: _slotData.attributes }, invoiceId: childrenDeals[n], invoices: childrenDeals2, uploadStatus: false }];
                  resetStoragescanItems([tmp, ...scanItems.filter((e) => e.flight.data.id !== idFlightsToDownloads[i])]);
                }
              }
            }
          }
        }
      }
    }
  }
  setLoading(false);
}
