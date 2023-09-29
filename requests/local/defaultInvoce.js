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
      relationships: {
        stage: {
          data: {
            type: "deal-stages",
            id: fields["idStageInvoce"],
          },
        },
      },
    },
  }
};

export default defaultInvoce;
