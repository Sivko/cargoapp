import { View } from "react-native";

import InvoceList from "@/components/invoces/InvoceList";

function Invoices() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <InvoceList />
    </View>
  );
}

export default Invoices;
