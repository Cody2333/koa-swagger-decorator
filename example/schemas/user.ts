import { z } from "../../lib";

const UserStruct = z.object({
  uid: z.string().nonempty(),
  name: z.string(),
});

const GetUserByIdRequest = z.object({
  uid: z.string().nullable(),
});

const GetUserByIdResponse = z.object({
  user: UserStruct,
  message: z.string().nullable(),
});

export { UserStruct, GetUserByIdRequest, GetUserByIdResponse };
