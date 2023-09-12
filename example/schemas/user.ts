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
  count: z.coerce.number().default(10),
  limit: z.coerce.number().default(0),
});

const ListUserResponse = z.object({
  users: z.array(UserStruct),
});

const CreateUserReq = z.object({
  uid: z.string().nonempty(),
  name: z.string().nullable().optional(),
  age: z.number().min(18).nullable(),
  operator: z.string().nonempty().optional(),
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

export type IGetUserByIdResponse = z.infer<typeof GetUserByIdResponse>;
export type ICreateUserRes = z.infer<typeof CreateUserRes>;
export type ICreateUserReq = z.infer<typeof CreateUserReq>;
export type IListUserRes = z.infer<typeof ListUserResponse>;
export type IListUserReq = z.infer<typeof ListUsersRequest>;
