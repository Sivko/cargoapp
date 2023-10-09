// import scanStore from "@/stores/scanStore";

import axios from "axios";

import config, { stagesCategories, timeout } from "@/requests/config";
var RNFS = require('react-native-fs');

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
                  // Загрузка фото
                  // https://app.salesap.ru/api/v1/documents?filter[entity_type]=Deal&filter[entity_id]=7504282
                  let tmpPhotos = [];
                  const photos = await axios.get(`https://app.salesap.ru/api/v1/documents?filter[entity_type]=Deal&filter[entity_id]=${_slotData.id}`, config(user?.token));
                  if (photos.data?.data?.length) {
                    const _photos = photos.data.data.filter((e) => e.attributes['content-type'].includes('image'))
                    for (let l in _photos) {
                      console.log("start photo downloads");
                      const _res = await RNFS.downloadFile({
                        fromUrl: _photos[l].attributes["download-link"],
                        toFile: `${RNFS.PicturesDirectoryPath}/${_photos[l].attributes.name}`,
                        headers: {
                          Authorization: `Bearer mUYmfdF5Hr0zUC9b3WLmR94p_DH4-GPkdQ42FmBZpv0`,
                        }
                      }).promise.then((response) => {
                        tmpPhotos.push({name: `${_photos[l].attributes.name}`, upload: true, type: _photos[l].attributes["content-type"], uri: `file://${RNFS.PicturesDirectoryPath}/${_photos[l].attributes.name}`, fileCopyUri: `file://${RNFS.PicturesDirectoryPath}/${_photos[l].attributes.name}`})
                      })
                    }
                    console.log("end formating tmp")
                  }
                  // Конец Загрузки фото
                  tmp.slots = [...tmp.slots, {photos: tmpPhotos, data: { id: _slotData.id, type: 'deals', attributes: _slotData.attributes }, invoiceId: childrenDeals[n], invoices: childrenDeals2, uploadStatus: false }];
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
