import { View, FlatList, StyleSheet } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "react-native-paper";
import { IBillingOperator } from "@/models/billingOperators";
import { useQuery, useRealm } from "@realm/react";
import { ObjectId } from "bson";
import { IOperatorInput, OperatorInput } from "@/components/OperatorInput";

//issue: create button disappears when adding more than 2
const BillingOperators = () => {
  const realm = useRealm();
  const billingOperatorData = useQuery<IBillingOperator>("BillingOperator");
  const flatListRef = useRef<any>();
  const scrollToBottom = () => {
    flatListRef?.current.scrollToEnd({ animated: true });
  };
  const [data, setData] = useState<Array<IOperatorInput>>([]);

  const [isPendingItemCreate, setIsPendingItemCreate] = useState(false);

  const onFieldCreatePress = (data: IBillingOperator) => {
    realm.write(() => {
      realm.create<IBillingOperator>("BillingOperator", {
        _id: new ObjectId(),
        billingInfo: data.billingInfo,
        operatorName: data.operatorName,
      });
    });

    setIsPendingItemCreate(false);
  };
  const onFieldUpdatePress = ({
    _id,
    billingInfo,
    operatorName,
  }: IBillingOperator) => {
    realm.write(() => {
      const updatedField = realm
        .objects<IBillingOperator>("BillingOperator")
        .find((o) => o._id.equals(_id));

      if (updatedField) {
        console.log("updating field");
        updatedField.billingInfo = billingInfo;
        updatedField.operatorName = operatorName;
      } else {
        console.log("vai", updatedField);
      }
    });
  };
  const onFieldRemovePress = (id: Realm.BSON.ObjectId) => {
    realm.write(() => {
      const removedField = realm
        .objects<IBillingOperator>("BillingOperator")
        .find((o) => o._id.equals(id));
      realm.delete(removedField);
    });
  };
  const onFieldDismissPress = (id: Realm.BSON.ObjectId) => {
    setData((prev) => prev.filter((item) => !item.id.equals(id)));
    setIsPendingItemCreate(false);
  };

  useEffect(() => {
    setData(
      (billingOperatorData.toJSON() as IBillingOperator[]).map((operator) => {
        return {
          billingInfo: operator.billingInfo,
          id: operator._id,
          operatorName: operator.operatorName,
        };
      })
    );
  }, [billingOperatorData]);

  const createNewRuleHandler = () => {
    const id = new ObjectId();
    scrollToBottom();
    setIsPendingItemCreate(true);
    setData([
      ...data,
      {
        operatorName: "",
        billingInfo: "",
        id: id,
        isNewRule: true,
      },
    ]);
  };

  const renderItem = ({ item }: { item: IOperatorInput }) => (
    <View>
      <OperatorInput
        id={item.id}
        billingInfo={item.billingInfo}
        operatorName={item.operatorName}
        isNewRule={item.isNewRule}
        onFieldCreatePress={(data) => onFieldCreatePress(data)}
        onFieldUpdatePress={(data) => onFieldUpdatePress(data)}
        onFieldRemovePress={(id) =>
          item.isNewRule ? onFieldDismissPress(id) : onFieldRemovePress(id)
        }
      />
    </View>
  );

  const CreateNewOperatorBillingButton: React.FC<{ disabled: boolean }> = ({
    disabled = false,
  }) => (
    <View>
      <Button
        mode="contained"
        icon={"plus"}
        disabled={disabled}
        onPress={() => createNewRuleHandler()}
      >
        Create
      </Button>
    </View>
  );

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={[...data]}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id.toString()}
        contentContainerStyle={styles.container}
        ListFooterComponent={() => (
          <CreateNewOperatorBillingButton disabled={isPendingItemCreate} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 30,
    paddingVertical: 30,
    // height: "100%",
  },
  input: { marginVertical: 5 },
  row: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 20,
    justifyContent: "space-between",
  },
});

export default BillingOperators;