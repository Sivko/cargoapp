import { fields } from "../config";

function defaultInvoce({ name, clientCode, numberTTN }) {
  return {
    data: {
      type: "deals",
      attributes: {
        name: name || "",
        customs: {
          [fields["clientCode"]]: clientCode || "",
          [fields["numberTTN"]]: numberTTN || "",
        },
      },
    },
  }
};

export default defaultInvoce;
