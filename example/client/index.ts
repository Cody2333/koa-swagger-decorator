import OpenAPIClientAxios from "openapi-client-axios";
import { Client } from "./openapi";
import common from "../config";
const api = new OpenAPIClientAxios({
  definition: "http://localhost:3000/api/swagger-json",
  axiosConfigDefaults: {
    baseURL: common.baseUrl,
  },
});
api.init();
async function createPet() {
  const client = await api.getClient<Client>();
  const ret = await client.CreateUser(
    null,
    { age: 18, uid: "aa" },
    {
      headers: { Authorization: "aa" },
    }
  );
  console.log("response", ret.data);
}

createPet();
