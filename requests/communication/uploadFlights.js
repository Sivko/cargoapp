import axios from "axios";

import config, { fields, stagesCategories, stagesFirstId } from "@/requests/config";
import { setLogsData } from "@/requests/local/getSetLogs";
import markText from '@/components/markText'

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
        // console.log("items", items[i])
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
        tmp.data.attributes.customs[fields["scanTSD"]] = items[i]?.data?.attributes?.customs[fields["scanTSD"]]  != "Найдено" ? "Ошибка" : items[i]?.data?.attributes?.customs[fields["scanTSD"]];
        // let xx = tmp.data.attributes.customs[fields["scanTSD"]];
        // debugger;
        // tmp.data.relationships?.stage?.data?.id = scanItems[m]?.flight?.data?.id;
        // console.log(tmp);
        // console.log(scanItems[m])
        // return
        let slotId = tmp?.data?.id
        let responseServer;
        if (slotId) {
          console.log("обновление");
          const url = `https://app.salesap.ru/api/v1/deals/${tmp.data.id}`;
          // Обновляем по токену Админа!
          const res = await axios.put(url, { data: tmp.data }, config()).catch(e => { setLogsData({ type: "error", status: e }); console.log(e, "error") });
          responseServer = res.data.data;
          // console.log("Обновлено", res);
        } else {
          // try {
          console.log("добавление");
          const url = `https://app.salesap.ru/api/v1/deals`;
          tmp.data.relationships = {
            user: {
              data: {
                type: "users",
                id: user?.directorId || user.id
              }
            },
            responsible: {
              data: {
                type: "users",
                id: user.id
              }
            },
            deals: {
              data: [{
                type: "deals",
                id: scanItems[m]?.slots[i]?.invoiceId || scanItems[m]?.slots[0]?.invoices[0].id,
              }]
            },
            stage: {
              data: {
                type: "deal-stages",
                id: stagesFirstId.slot,
              },
            },
          };
          const res = await axios.post(url, { data: tmp.data }, config(user?.token)).catch(e => setLogsData({ type: "error", status: e }));
          console.log(res.status, scanItems[m]?.slots[0]?.invoices[0].id);
          if (res.status >= 400) {
            setLogsData({ type: "error", status: res.data })
            continue;
          }
          responseServer = res.data.data;
          slotId = res.data.data.id;
          // } catch (err) {console.log("не удалось добавить", err); setLogsData({ type: "error", status: err })}
        }
        /* загрузка Фото */
        if (items[i].photos) {
          const photosSlot = items[i].photos.filter(e => !e.upload);
          // console.log(items[i].photos, "items[i].photos");
          for (let f in photosSlot) {
            console.log(photosSlot[f], "photosSlot[f]")
            const tokenFile = await axios.post('https://upload.app.salesap.ru/api/v1/files', {
              "type": "files",
              "data": {
                "filename": photosSlot[f].name,
                "resource-type": "deals",
                "resource-id": Number(slotId)
              }
            }, config(user?.token)).catch(e => console.log(e));
            try {
              const fields = tokenFile.data.data["form-fields"];
              let formData = new FormData();
              for (let key in fields) {
                if (fields.hasOwnProperty(key)) {
                  formData.append(key, fields[key])
                }
              }
              let sklad = responseServer.attributes.customs["custom-99672"] ? responseServer.attributes.customs["custom-99672"][0] : ''
              let slotNumber = responseServer.attributes.customs["custom-119567"] ? responseServer.attributes.customs["custom-119567"] : ''
              const markToImage = await markText({ file: photosSlot[f], text1: slotNumber, text2: sklad });
              formData.append("file", { ...photosSlot[f], uri: markToImage });
              const uploadData = await axios.post('https://storage.yandexcloud.net/salesapiens', formData);
            } catch (err) { console.log(err, "Ошибка загрузки"); setLogsData({ type: "error", status: { msg: "Не удалось загрузить фото", err } }) }
            photosSlot[f].upload = true;
          }
        }
        // endUpload
        // console.log("AAAA")
        // console.log("slotId", slotId)
        scanItems[m].slots[i].uploadStatus = true;
        scanItems[m].slots[i].data.id = slotId;
        resetStoragescanItems(scanItems);
      }
    }
  }
  //обновление Рейсов и Квитанций
  for (let m in scanItems) {
    if (scanItems[m].slots) {
      const tmpInvoices = scanItems[m].slots.map((e) => ({ id: e.invoiceId, status: e.data.attributes.customs[fields["scanTSD"]] != "Найдено" ? "Ошибка" : "Найдено" }));
      let invoicesUnicId = tmpInvoices.filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.id === value.id
        ))
      );
      let invoicesStatus = []
      for (let x in invoicesUnicId) {
        const id = invoicesUnicId[x].id
        invoicesStatus.push({ id: id, statuses: tmpInvoices.filter(e => e.id == id).map(e => e.status) });
      }
      let errors = []
      for (let h in invoicesStatus) {
        if (invoicesStatus[h]?.statuses?.length) {
          // console.log("UPD")
          if (invoicesStatus[h]?.statuses.includes("Ошибка")) {
            // console.log("Error")
            await axios.patch(`https://app.salesap.ru/api/v1/deals/${invoicesStatus[h].id}`, { data: { type: 'deals', id: invoicesStatus[h].id, attributes: { customs: { [fields["scanTSD"]]: "Ошибка" } } } }, config(user?.token))
            errors.push(true)
          } else {
            // console.log("Success")
            await axios.patch(`https://app.salesap.ru/api/v1/deals/${invoicesStatus[h].id}`, { data: { type: 'deals', id: invoicesStatus[h].id, attributes: { customs: { [fields["scanTSD"]]: "Успешно" } } } }, config(user?.token))
          }
        }
      }
      if (errors.length) {
        // console.log("error Flight")
        await axios.patch(`https://app.salesap.ru/api/v1/deals/${scanItems[m].flight.data.id}`, { data: { type: 'deals', id: scanItems[m].flight.data.id, attributes: { customs: { [fields["scanTSD"]]: "Ошибка" } } } }, config(user?.token))
      } else {
        // console.log("Success flight")
        await axios.patch(`https://app.salesap.ru/api/v1/deals/${scanItems[m].flight.data.id}`, { data: { type: 'deals', id: scanItems[m].flight.data.id, attributes: { customs: { [fields["scanTSD"]]: "Успешно" } } } }, config(user?.token))
      }


      // console.log(tmpInvoices, "tmpInvoices");

      // let errorStatusSlots = scanItems[m].slots.filter(e => e.data.attributes.customs[fields["scanTSD"]] != "Найдено");
      // console.log(errorStatusSlots, "errorStatusSlots")
      // let successStatusSlots = scanItems[m].slots.filter(e => e.data.attributes.customs[fields["scanTSD"]] == "Найдено");
      // console.log(successStatusSlots, "successStatusSlots")
      // let invoicesUpdateToError = [];
      // let invoicesUpdateToSuccess = [];
      // for (let x in errorStatusSlots) {
      //   let id = errorStatusSlots[x].invoiceId;
      //   if (!invoicesUpdateToError.includes(id)) {
      //     invoicesUpdateToError.push(id);
      //   }
      // }
      // for (let x in successStatusSlots) {
      //   let id = errorStatusSlots[x].invoiceId;
      //   if (!invoicesUpdateToSuccess.includes(id)) {
      //     invoicesUpdateToSuccess.push(id);
      //   }
      // }
      // console.log(invoicesUpdateToError, "установлю ошибку у этих квитанций");
      // console.log(invoicesUpdateToError, "установлю успешно у этих квитанций");
      // for (let b in invoicesUpdateToError) {
      //   await axios.patch(`https://app.salesap.ru/api/v1/deals/${invoicesUpdateToError[b]}`, { data: { type: 'deals', id: invoicesUpdateToError[b], attributes: { customs: { [fields["scanTSD"]]: "Ошибка" } } } }, config(user?.token))
      // }
      // for (let b in invoicesUpdateToSuccess) {
      //   await axios.patch(`https://app.salesap.ru/api/v1/deals/${invoicesUpdateToSuccess[b]}`, { data: { type: 'deals', id: invoicesUpdateToSuccess[b], attributes: { customs: { [fields["scanTSD"]]: "Успешно" } } } }, config(user?.token))
      // }

      // if (invoicesUpdateToError.length) {
      //   await axios.patch(`https://app.salesap.ru/api/v1/deals/${scanItems[m].flight.data.id}`, { data: { type: 'deals', id: scanItems[m].flight.data.id, attributes: { customs: { [fields["scanTSD"]]: "Ошибка" } } } }, config(user?.token))
      // } else {
      //   await axios.patch(`https://app.salesap.ru/api/v1/deals/${scanItems[m].flight.data.id}`, { data: { type: 'deals', id: scanItems[m].flight.data.id, attributes: { customs: { [fields["scanTSD"]]: "Успешно" } } } }, config(user?.token))
      // }
    }
  }
  setLoading(false);
};
