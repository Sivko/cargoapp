import axios from "axios";
import config, { timeout } from "@/requests/config";

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
      tmp.slots[x].data.relationships.deals = {
        data: [
          {
            type: "deals",
            id: resInvoice.data.data.id,
          },
        ],
      };
      const res2 = await axios.post("https://app.salesap.ru/api/v1/deals", invocesToUpload[i].slots[x], config(user?.token))
        .catch((e) => setLoggerStore({ data: e.data?.message, date: new Date(), type: "send slot", status: "error", }));
      setLoggerStore({ type: "send slot", status: "Ok", date: new Date() });
      tmp.slots[x].data.id = res2.data.data.id;
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
            formData.append("file", photosSlot[f]);
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
