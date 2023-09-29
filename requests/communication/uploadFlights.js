import axios from "axios";

import config, { fields, stagesCategories, stagesFirstId } from "@/requests/config";
import { setLogsData } from "../local/getSetLogs";

const slotToUpload = {
  data: {
    type: "deals",
    attributes: {
      name: "",
      description: "",
      customs: {
        [fields["length"]]: "0",
        [fields["width"]]: "0",
        [fields["height"]]: "0",
        [fields["weight"]]: "0",
        [fields["barcode"]]: "",
        [fields["transport"]]: "",
        [fields["clientCode"]]: "",
        [fields["numberTTN"]]: "",
        [fields["scanTSD"]]: "Ошибка",
      },
    },
  },
  images: [],
};

export default async function uploadFlights({ resetStoragescanItems, scanItems, setLoading, user }) {
  setLoading(true);
  // console.log(scanItems.map(e=>e.slots))
  // return
  for (let m in scanItems) {
    if (scanItems[m].slots) {
      const items = scanItems[m].slots.filter(e => !e?.uploadStatus);
      for (let i in items) {
        // console.log("Upload", items[i]);
        let tmp = JSON.parse(JSON.stringify(slotToUpload));
        console.log("items", items[i])
        tmp.data.id = items[i]?.data?.id;
        tmp.data.attributes.name = items[i].data.attributes.name;
        tmp.data.attributes.description = items[i].data.attributes.description;
        tmp.data.attributes.customs[fields["length"]] = items[i].data.attributes.customs[fields["length"]];
        tmp.data.attributes.customs[fields["width"]] = items[i].data.attributes.customs[fields["width"]];
        tmp.data.attributes.customs[fields["height"]] = items[i].data.attributes.customs[fields["height"]];
        tmp.data.attributes.customs[fields["weight"]] = items[i].data.attributes.customs[fields["weight"]];
        tmp.data.attributes.customs[fields["barcode"]] = items[i].data.attributes.customs[fields["barcode"]];
        tmp.data.attributes.customs[fields["transport"]] = items[i].data.attributes.customs[fields["transport"]];
        tmp.data.attributes.customs[fields["clientCode"]] = items[i].data.attributes.customs[fields["clientCode"]];
        tmp.data.attributes.customs[fields["numberTTN"]] = items[i].data.attributes.customs[fields["numberTTN"]];
        tmp.data.attributes.customs[fields["scanTSD"]] = items[i]?.data?.attributes?.customs[fields["scanTSD"]] || "Ошибка";
        // let xx = tmp.data.attributes.customs[fields["scanTSD"]];
        // debugger;
        // tmp.data.relationships?.stage?.data?.id = scanItems[m]?.flight?.data?.id;
        // console.log(tmp);
        // console.log(scanItems[m])
        // return
        if (tmp.data?.id) {
          console.log("обновление");
          const url = `https://app.salesap.ru/api/v1/deals/${tmp.data.id}`;
          const res = await axios.put(url, { data: tmp.data }, config(user?.token)).catch(e => setLogsData({ "error": e }));
          // console.log("Обновлено", res);
        } else {
          console.log("добавление");
          const url = `https://app.salesap.ru/api/v1/deals`;
          tmp.data.relationships = {
            deals: {
              data: [{
                type: "deals",
                id: scanItems[m].slots[i].invoiceId || scanItems[m].slots[0].invoiceId,
              }]
            },
            stage: {
              data: {
                type: "deal-stages",
                id: stagesFirstId.slot,
              },
            },
          };
          // console.log(tmp.data.relationships, "FFFFF")
          const res = await axios.post(url, { data: tmp.data }, config(user?.token)).catch(e => setLogsData({ "error": e }));
          // console.log("Добавлено", res);
        }
        scanItems[m].slots[i].uploadStatus = true;
        // tmp.status = true;

        resetStoragescanItems(scanItems);
      }
    }
  }
  //обновление Рейсов и Квитанций
  for (let m in scanItems) {
    if (scanItems[m].slots) {
      let errorStatusSlots = scanItems[m].slots.filter(e => e.data.attributes.customs[fields["scanTSD"]] != "Найдено");
      let successStatusSlots = scanItems[m].slots.filter(e => e.data.attributes.customs[fields["scanTSD"]] == "Найдено");
      let invoicesUpdateToError = [];
      let invoicesUpdateToSuccess = [];
      for (let x in errorStatusSlots) {
        let id = errorStatusSlots[x].invoiceId;
        if (!invoicesUpdateToError.includes(id)) {
          invoicesUpdateToError.push(id);
        }
      }
      for (let x in successStatusSlots) {
        let id = errorStatusSlots[x].invoiceId;
        if (!invoicesUpdateToSuccess.includes(id)) {
          invoicesUpdateToSuccess.push(id);
        }
      }
      console.log(invoicesUpdateToError, "установлю ошибку у этих квитанций");
      for (let b in invoicesUpdateToError) {
        await axios.patch(`https://app.salesap.ru/api/v1/deals/${invoicesUpdateToError[b]}`, { data: { type: 'deals', id: invoicesUpdateToError[b], attributes: { customs: { [fields["scanTSD"]]: "Ошибка" } } } }, config(user?.token))
      }
      for (let b in invoicesUpdateToSuccess) {
        await axios.patch(`https://app.salesap.ru/api/v1/deals/${invoicesUpdateToSuccess[b]}`, { data: { type: 'deals', id: invoicesUpdateToSuccess[b], attributes: { customs: { [fields["scanTSD"]]: "Успешно" } } } }, config(user?.token))
      }

      if (invoicesUpdateToError.length) {
        await axios.patch(`https://app.salesap.ru/api/v1/deals/${scanItems[m].flight.data.id}`, { data: { type: 'deals', id: scanItems[m].flight.data.id, attributes: { customs: { [fields["scanTSD"]]: "Ошибка" } } } }, config(user?.token))
      } else {
        await axios.patch(`https://app.salesap.ru/api/v1/deals/${scanItems[m].flight.data.id}`, { data: { type: 'deals', id: scanItems[m].flight.data.id, attributes: { customs: { [fields["scanTSD"]]: "Успешно" } } } }, config(user?.token))
      }
    }
  }
  setLoading(false);
};
