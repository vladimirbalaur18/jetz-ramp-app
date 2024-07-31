import { IFlight } from "@/models/Flight";
import { IServiceCategory } from "@/models/ServiceCategory";
import { useQuery, useRealm } from "@realm/react";
import React, { useEffect } from "react";
import { Control, useFieldArray } from "react-hook-form";

export const useProvidedServicesFields = ({
  existingFlight,
  control,
}: {
  existingFlight: IFlight;
  control: Control<IFlight>;
}) => {
  console.log("executing useProvidedServicesFields");
  const { fields, append, update, remove } = useFieldArray({
    control,
    name: "providedServices.otherServices",
  });
  const realmServices = useQuery<IServiceCategory>("ServiceCategory");
  const defaultServicesPerCategories = realmServices.flatMap((sc) => [
    ...sc.services,
  ]);

  //TODO: fix null service present in providedServices after it;s removed
  useEffect(() => {
    console.warn("Appending services");
    if (fields && fields.length) remove();
    if (!existingFlight.providedServices) {
      console.log("straight here");
      append([
        ...defaultServicesPerCategories.map((s) => ({
          service: s,
          isUsed: false,
          isPriceOverriden: false,
          quantity: 0,
        })),
      ]);
    } else {
      let pushedServices: Record<string, boolean> = {};

      if (existingFlight?.providedServices?.otherServices) {
        console.warn(
          "useProvidedServicesFields appending other services",
          JSON.stringify(
            existingFlight.providedServices.otherServices.filter(
              (ser) => ser?.service?._id
            ),
            null
          )
        );
        append([
          ...existingFlight.providedServices.otherServices
            .filter((ser) => ser?.service?._id)
            .map((s) => ({
              service: s.service,
              isUsed: s.isUsed,
              isPriceOverriden: s.isPriceOverriden,
              quantity: s.quantity,
              notes: s.notes || "",
              totalPriceOverride: s.totalPriceOverride,
            })),
        ]);
      }
      //loops through root services and see if there are some new services that didn't exist previously
      existingFlight.providedServices.otherServices
        ?.filter((_) => _.service)
        ?.forEach((s) => {
          if (s.service) {
            pushedServices[s?.service?.serviceName] = true;
          }
        });
      defaultServicesPerCategories.map((s) => {
        if (!pushedServices[s?.serviceName]) {
          append({
            service: s,
            isUsed: false,
            isPriceOverriden: false,
            quantity: 0,
          });
        }
      });
    }

    return () => remove();
  }, []);
  return {
    fields: fields.filter((f) => f?.id && f?.service?._id),
    update,
    remove,
  };
};
