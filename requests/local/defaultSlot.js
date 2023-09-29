import { fields } from "../config";

export function defaultSlot({ clientCode, numberTTN }) {
  return {
    data: {
      type: "deals",
      attributes: {
        name: "Slot",
        description: "",
        customs: {
          [fields["length"]]: "0",
          [fields["width"]]: "0",
          [fields["height"]]: "0",
          [fields["weight"]]: "0",
          [fields["barcode"]]: "",
          [fields["transport"]]: "AIRLINE",
          [fields["clientCode"]]: clientCode || "",
          [fields["numberTTN"]]: numberTTN || "",
        },
      },
      relationships: {
        stage: {
          data: {
            type: "deal-stages",
            id: fields["idStageSlot"],
          },
        },
      },
    },
    images: [],
  };
}

export default defaultSlot;
