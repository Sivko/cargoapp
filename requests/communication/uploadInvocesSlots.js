import axios from "axios";
import config, { timeout } from "@/requests/config";

export async function uploadInvocesSlots({
  resetStorageInvocesToUpload,
  invocesToUpload,
  setLoggerStore,
  setLoading,
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
        config,
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
      const res2 = await axios.post("https://app.salesap.ru/api/v1/deals", invocesToUpload[i].slots[x], config)
        .catch((e) => setLoggerStore({ data: e.data?.message, date: new Date(), type: "send slot", status: "error", }));
      tmp.slots[x].data.id = res2.data.data.id;
      resetStorageInvocesToUpload([
        tmp,
        ...invocesToUpload.filter((e, index) => index !== Number(i))
      ]);
    }
  }
  setLoading(false);
}

export default uploadInvocesSlots;
