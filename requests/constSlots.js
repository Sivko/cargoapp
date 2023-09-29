export default function constSlots() {
  return [
    {
      data: {
        id: 1456,
        type: "deals",
        attributes: {
          name: "1-7149582",
          customs: {
            custom_114632: 10,
            custom_114633: 10,
            custom_114634: 10,
          },
        },
      },
    },
    {
      data: {
        id: 1457,
        type: "deals",
        attributes: {
          name: "1-7149586",
          customs: {
            custom_114632: 10,
            custom_114633: 10,
            custom_114634: 10,
          },
        },
      },
    },
    {
      data: {
        id: 1458,
        type: "deals",
        attributes: {
          name: "1-7127284",
          customs: {
            custom_114632: 10,
            custom_114633: 10,
            custom_114634: 10,
          },
        },
      },
    },
  ];
}

export function emptySlot() {
  return {
    type: "deals",
    attributes: {
      name: "",
      customs: {
        custom_114632: 0,
        custom_114633: 0,
        custom_114634: 0,
      },
    },
  };
}
