import { IAppData } from "@/models/AppData";
import { IServiceCategory } from "@/models/ServiceCategory";
import { realmWithoutSync } from "@/realm";
import DefaultServices from "@/configs/serviceDefinitions.json";
import { ObjectId } from "bson";
import { Service } from "@/models/Services";
import { Alert } from "react-native";

export const initializeServices = () => {
  const serviceCategories =
    realmWithoutSync.objects<IServiceCategory>("ServiceCategory");

  if (!serviceCategories?.length) {
    try {
      DefaultServices.forEach(({ serviceCategoryName, services }) => {
        const category = realmWithoutSync.write(() => {
          const _cat = realmWithoutSync.create<IServiceCategory>(
            "ServiceCategory",
            {
              _id: new ObjectId(),
              categoryName: serviceCategoryName,
            }
          );

          return _cat;
        });

        realmWithoutSync.write(() =>
          services.map((s) =>
            category.services.push(
              new Service(realmWithoutSync, {
                _id: new ObjectId(),
                categoryName: serviceCategoryName,
                ...s,
              })
            )
          )
        );
      });
    } catch (err) {
      Alert.alert(
        "Error initializing services",
        //@ts-expect-error
        err?.message || JSON.stringify(err)
      );
    }
  }
};
