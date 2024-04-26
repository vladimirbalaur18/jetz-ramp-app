import Realm from "realm";
import ConfigModel from "./models/Config";

const realmConfig: Realm.Configuration = {
  schema: [ConfigModel],
};

const realm = new Realm(realmConfig);

export default realm;
