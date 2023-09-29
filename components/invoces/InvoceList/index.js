import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";

import invocesToUploadStore from "@/stores/invocesToUploadStore";
export default function InvoceList() {
  const {
    invocesToUpload,
    getStorageInvocesToUpload,
    resetStorageInvocesToUpload,
  } = invocesToUploadStore();
  useEffect(() => {
    getStorageInvocesToUpload();
  }, []);

  const [dataList, setDataList] = useState(invocesToUpload.map((e, index) => ({ ...e, index })));

  useEffect(() => {
    setDataList(invocesToUpload.map((e, index) => ({ ...e, index })));
  }, [invocesToUpload]);

  const deleteItem = (rowMap, rowKey) => {
    const tmpData = dataList.filter((e, index) => index !== rowKey);
    resetStorageInvocesToUpload(tmpData);
  };

  const renderItem = (data) => (
    <TouchableHighlight
      // onPress={onPress}
      style={styles.rowFront}
      underlayColor="#fff"
    >
      <View style={styles.card}>
        <View style={styles.index}>
          <Text>{data.item.index + 1}</Text>
        </View>

        <View style={styles.info}>
          <Text style={{ width: "100%" }}>
            Название: {data?.item?.invoice?.data?.attributes?.name}
          </Text>
          <Text style={{ width: "100%" }}>
            Кол-во мест: {data?.item?.slots?.length}
          </Text>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              gap: 10,
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Text style={{ color: "#ddd" }}>
              Отправлено мест: {data.item?.slots.filter((e) => e.data.id).length}
            </Text>
            {!data.item?.invoice?.data?.id && (
              <Feather name="upload-cloud" size={24} color="#ddd" />
              // <Text>icon</Text>
            )}
            {data.item?.slots?.length === data.item?.slots.filter((e) => e.data.id).length && (
              <Feather name="upload-cloud" size={24} color="#2196f3" />
              // <Text>icon</Text>
            )}
            {data.item?.invoice?.data?.id && data.item?.slots?.length !== data.item?.slots.filter((e) => e.data.id).length && (
              <Feather name="upload-cloud" size={24} color="#deb617" />
              // <Text>icon</Text>
            )}
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.actionButton, styles.deleteBtn]}
        onPress={() => deleteItem(rowMap, data.item.index)}
      >
        <AntDesign name="delete" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {invocesToUpload.length ? (
        <SwipeListView
          data={dataList}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          // leftOpenValue={75}
          rightOpenValue={-75}
          previewRowKey="0"
          previewOpenValue={-40}
          previewOpenDelay={3000}
        />
      ) : (
        <Text
          style={{ width: "100%", paddingHorizontal: 100, paddingVertical: 20 }}
        >
          С данного ТСД пока ни одной квитанции не добавлено!
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    width: "100%",
    position: "relative",
  },
  list: {
    color: "#FFF",
  },
  btnText: {
    color: "#FFF",
  },
  rowFront: {
    alignItems: "center",
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 5,
  },
  actionButton: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75,
  },
  deleteBtn: {
    backgroundColor: "red",
    right: 0,
  },

  card: {
    justifyContent: "space-between",
    flexDirection: "row",
    height: 112,
    alignItems: "center",
    borderBottomColor: "#f1f1f1",
    borderStyle: "solid",
    borderBottomWidth: 1,
    width: "100%",
    position: "relative",
  },
  index: {
    flexBasis: "10%",
    alignItems: "center",
  },
  image: {
    flexBasis: "40%",
  },
  info: {
    flexBasis: "100%",
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
});
