import * as castleStores from "../store";
import * as request from "./request";
import * as rsaEncrypt from "./rsa-encrypt";
import * as eventBus from "./event-bus";

import { usePermissionStore } from "#/store";

const checkPermission = (codes) => {
  const permissionStore = usePermissionStore();
  return permissionStore.checkPermission(codes);
};

const utils = { castleStores, ...request, ...rsaEncrypt, ...eventBus, checkPermission };

export default (app) => {
  for (const i in utils) {
    app.provide(i, utils[i]);
  }
};
