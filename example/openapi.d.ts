import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios'; 

declare namespace Components {
    namespace Schemas {
        export interface DemoControllerGetDemoResponse {
            /**
             * example:
             * gg
             */
            msg: string;
        }
        export interface ExtraSchemasA {
            id?: string;
        }
        export interface ExtraZodSchema {
            /**
             * example:
             * 20
             */
            age: number;
        }
        export interface UserControllerCreateUserBodyRequest {
            uid: string;
            name?: string | null;
            age: number | null;
            operator?: string;
        }
        export interface UserControllerCreateUserResponse {
            id: string | null;
            message: string | null;
        }
        export interface UserControllerGetUserByIdResponse {
            user: {
                id: string | null;
                uid: string;
                name: string | null;
                age: number | null;
                randomKey: string | null;
            };
            message: string | null;
        }
        export interface UserControllerListUsersResponse {
            users: {
                id: string | null;
                uid: string;
                name: string | null;
                age: number | null;
                randomKey: string | null;
            }[];
        }
        export interface UserControllerUpdateUserBodyRequest {
            id: string;
            name: string | null;
            operator: string;
        }
        export interface UserControllerUpdateUserResponse {
            id: string | null;
            message: string | null;
        }
    }
}
declare namespace Paths {
    namespace CreateUser {
        export type RequestBody = Components.Schemas.UserControllerCreateUserBodyRequest;
        namespace Responses {
            export type $200 = Components.Schemas.UserControllerCreateUserResponse;
        }
    }
    namespace Demo {
        namespace Get {
            namespace Parameters {
                /**
                 * example:
                 * 110
                 */
                export type Xxx = string | null;
            }
            export interface QueryParameters {
                xxx?: /**
                 * example:
                 * 110
                 */
                Parameters.Xxx;
            }
            namespace Responses {
                export type $200 = Components.Schemas.DemoControllerGetDemoResponse;
            }
        }
    }
    namespace GetUserById {
        namespace Parameters {
            export type Uid = string;
        }
        export interface PathParameters {
            uid: Parameters.Uid;
        }
        namespace Responses {
            export type $200 = Components.Schemas.UserControllerGetUserByIdResponse;
        }
    }
    namespace ListUsers {
        namespace Parameters {
            export type Count = number;
            export type Limit = number;
        }
        export interface QueryParameters {
            count: Parameters.Count;
            limit: Parameters.Limit;
        }
        namespace Responses {
            export type $200 = Components.Schemas.UserControllerListUsersResponse;
        }
    }
    namespace UpdateUser {
        export type RequestBody = Components.Schemas.UserControllerUpdateUserBodyRequest;
        namespace Responses {
            export type $200 = Components.Schemas.UserControllerUpdateUserResponse;
        }
    }
}

export interface OperationMethods {
  /**
   * GetUserById - get user by id
   * 
   * detailed user
   */
  'GetUserById'(
    parameters?: Parameters<Paths.GetUserById.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetUserById.Responses.$200>
  /**
   * ListUsers - 获取用户列表
   * 
   * merge description
   */
  'ListUsers'(
    parameters?: Parameters<Paths.ListUsers.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ListUsers.Responses.$200>
  /**
   * CreateUser - 创建用户
   */
  'CreateUser'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateUser.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.CreateUser.Responses.$200>
  /**
   * UpdateUser
   */
  'UpdateUser'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.UpdateUser.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.UpdateUser.Responses.$200>
}

export interface PathsDictionary {
  ['/user/{uid}']: {
    /**
     * GetUserById - get user by id
     * 
     * detailed user
     */
    'get'(
      parameters?: Parameters<Paths.GetUserById.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetUserById.Responses.$200>
  }
  ['/users']: {
    /**
     * ListUsers - 获取用户列表
     * 
     * merge description
     */
    'get'(
      parameters?: Parameters<Paths.ListUsers.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ListUsers.Responses.$200>
    /**
     * CreateUser - 创建用户
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateUser.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.CreateUser.Responses.$200>
  }
  ['/users/update']: {
    /**
     * UpdateUser
     */
    'put'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.UpdateUser.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.UpdateUser.Responses.$200>
  }
  ['/demo']: {
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>
