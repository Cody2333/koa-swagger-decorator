import { z } from "../../lib";

const UserStruct = z.object({
  id: z.string().nullable(),
  uid: z.string().nonempty(),
  name: z.string().nullable(),
  age: z.number().min(18).nullable(),
  randomKey: z.string().nullable(),
});

const GetUserByIdRequest = z.object({
  uid: z.string().nullable(),
});

const GetUserByIdResponse = z.object({
  user: UserStruct,
  message: z.string().nullable(),
});

const ListUsersRequest = z.object({
  count: z.number().default(10),
  limit: z.number().default(0),
});

const ListUserResponse = z.object({
  users: z.array(UserStruct),
});

const CreateUserReq = z.object({
  uid: z.string().nonempty(),
  name: z.string().nullable(),
  age: z.number().min(18).nullable(),
  operator: z.string().nonempty(),
});

const CreateUserRes = z.object({
  id: z.string().nullable(),
  message: z.string().nullable(),
});

const UpdateUserReq = z.object({
  id: z.string().nonempty(),
  name: z.string().nullable(),
  operator: z.string().nonempty(),
});

const UpdateUserRes = z.object({
  id: z.string().nullable(),
  message: z.string().nullable(),
});

export {
  UserStruct,
  GetUserByIdRequest,
  GetUserByIdResponse,
  CreateUserReq,
  UpdateUserReq,
  CreateUserRes,
  UpdateUserRes,
  ListUserResponse,
  ListUsersRequest,
};
