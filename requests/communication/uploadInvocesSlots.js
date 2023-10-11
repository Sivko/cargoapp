import axios from "axios";
import config, { timeout } from "@/requests/config";
import markText from '@/components/markText'
import { fields } from "../config";

export async function uploadInvocesSlots({
  resetStorageInvocesToUpload,
  invocesToUpload,
  setLoggerStore,
  setLoading,
  user
}) {
  // console.log(invocesToUpload, setLoggerStore, resetStorageInvocesToUpload);
  setLoading(true);
  if (!invocesToUpload.filter((e) => !e.invoice.data.id).length) {
    setLoading(false);
    alert("Нет данных для отправки");
    return;
  }
  for (const i in invocesToUpload.filter((e) => !e.invoice.data.id)) {
    console.log(`https://app.salesap.ru/api/v1/contacts?filter[custom-102342]=${invocesToUpload[i].invoice.data.attributes.customs[fields["clientCode"]]}`);
    const contact = await axios.get(`https://app.salesap.ru/api/v1/contacts?filter[custom-102342]=${invocesToUpload[i].invoice.data.attributes.customs[fields["clientCode"]]}`, config(user?.token));
    invocesToUpload[i].invoice.data.relationships = {
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
    }
    if (contact.data?.data?.length) {
      invocesToUpload[i].invoice.data.relationships.contact = {
        "data": {
          "type": "contacts",
          "id": Number(contact.data.data[0].id)
        },
      }
    }
    const resInvoice = await axios
      .post(
        "https://app.salesap.ru/api/v1/deals",
        invocesToUpload[i].invoice,
        config(user?.token),
      )
      .catch((e) =>
        setLoggerStore({
          data: e.data?.message,
          type: "send invoice",
          status: "error",
          date: new Date(),
        }),
      );
    setLoggerStore({ type: "send invoce", status: "Ok", date: new Date() });
    const tmp = invocesToUpload[i];
    tmp.invoice.data.id = resInvoice.data.data.id;
    resetStorageInvocesToUpload([
      tmp,
      ...invocesToUpload.filter((e, index) => index !== Number(i))
    ]);
    await new Promise((r) => setTimeout(r, timeout));
    for (const x in invocesToUpload[i].slots) {
      tmp.slots[x].data.relationships.user = {
        data: {
          type: "users",
          id: user?.directorId || user.id
        }
      };
      tmp.slots[x].data.relationships.responsible = {
        data: {
          type: "users",
          id: user.id
        }
      };
      tmp.slots[x].data.relationships.deals = {
        data: [
          {
            type: "deals",
            id: resInvoice.data.data.id,
          },
        ],
      };
      if (contact.data?.data?.length) {
        tmp.slots[x].data.relationships.contact = {
          "data": {
            "type": "contacts",
            "id": Number(contact.data.data[0].id)
          }
        }
      }
      const res2 = await axios.post("https://app.salesap.ru/api/v1/deals", invocesToUpload[i].slots[x], config(user?.token))
        .catch((e) => setLoggerStore({ data: e.data?.message, date: new Date(), type: "send slot", status: "error", }));
      setLoggerStore({ type: "send slot", status: "Ok", date: new Date() });
      tmp.slots[x].data.id = res2.data.data.id;
      let responseServer = res2.data.data
      /* загрузка Фото */
      if (invocesToUpload[i].slots[x].photos) {
        const photosSlot = invocesToUpload[i].slots[x].photos.filter(e => !e.upload);
        for (let f in photosSlot) {
          const tokenFile = await axios.post('https://upload.app.salesap.ru/api/v1/files', {
            "type": "files",
            "data": {
              "filename": photosSlot[f].name,
              "resource-type": "deals",
              "resource-id": Number(res2.data.data.id)
            }
          }, config(user?.token)).catch(e => console.log(e.response.data));
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
            console.log(uploadData, "Загрузил фото");
          } catch (err) { console.log("Не удалось загрузить", err) }
          photosSlot[f].upload = true;
        }
      }
      // endUpload
      resetStorageInvocesToUpload([
        tmp,
        ...invocesToUpload.filter((e, index) => index !== Number(i))
      ]);
    }
  }
  setLoading(false);
}

export default uploadInvocesSlots;
