import Realm, { ObjectSchema } from "realm";

export type IPersonNameSignature = { signature?: string; name?: string };
export class PersonNameSignature extends Realm.Object<IPersonNameSignature> {
  signature?: string;
  name?: string;

  static schema: ObjectSchema = {
    name: "PersonNameSignature",
    properties: {
      signature: "string?",
      name: "string?",
    },
  };
}
