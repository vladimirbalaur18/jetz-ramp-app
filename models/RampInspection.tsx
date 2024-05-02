import Realm, { ObjectSchema } from "realm";
import { IRampAgent } from "./RampAgentName";

export type IRampInspection = {
  status: boolean;
  FOD: boolean;
  agent: IRampAgent;
};
export class RampInspection extends Realm.Object<IRampInspection> {
  status!: boolean;
  FOD!: boolean;
  agent!: IRampAgent;

  static schema: ObjectSchema = {
    name: "RampInspection",
    properties: {
      status: "bool",
      FOD: "bool",
      agent: {
        type: "object",
        objectType: "RampAgent",
      },
    },
  };
}
