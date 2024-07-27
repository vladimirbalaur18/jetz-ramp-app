import { IFlight } from "@/models/Flight";
import { realmWithoutSync } from "@/realm";
import { isUndefined } from "lodash";

export default function _selectCurrentFlight(flightId: string) {
  const flight = realmWithoutSync
    .objects<IFlight>("Flight")
    .find((f) => f.flightId === flightId);

  return flight;
}
