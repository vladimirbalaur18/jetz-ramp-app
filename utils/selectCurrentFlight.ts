import { IFlight } from "@/models/Flight";
import { realmWithoutSync } from "@/realm";
import { isUndefined } from "lodash";

export default function _selectCurrentFlight(flightId: string) {
  if (isUndefined(flightId)) throw new Error(' Provided flightId is not valid');
  const flight = realmWithoutSync
    .objects<IFlight>("Flight")
    .find((f) => f.flightId === flightId);


  if (isUndefined(flight)) throw new Error('Could not find flight in realm database. Provided flightId is not valid');

  return flight;
}
