# UsersApi

All URIs are relative to *http://localhost:8080/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**adminUsersGet**](#adminusersget) | **GET** /admin/users | Get all users|
|[**adminUsersIdDelete**](#adminusersiddelete) | **DELETE** /admin/users/{id} | Delete user|
|[**adminUsersIdPut**](#adminusersidput) | **PUT** /admin/users/{id} | Update user|
|[**adminUsersPost**](#adminuserspost) | **POST** /admin/users | Create user|

# **adminUsersGet**
> Array<AdminUsersGet200ResponseInner> adminUsersGet()

Получение списка всех зарегистрированных пользователей. Только для администратора.

### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

const { status, data } = await apiInstance.adminUsersGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<AdminUsersGet200ResponseInner>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of users |  -  |
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminUsersIdDelete**
> adminUsersIdDelete()

Удаление пользователя из системы. Только для администратора.

### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.adminUsersIdDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Deleted |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden (not admin) |  -  |
|**404** | User not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminUsersIdPut**
> adminUsersIdPut()

Обновление информации о пользователе. Только для администратора.

### Example

```typescript
import {
    UsersApi,
    Configuration,
    AdminUsersIdPutRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let id: number; // (default to undefined)
let adminUsersIdPutRequest: AdminUsersIdPutRequest; // (optional)

const { status, data } = await apiInstance.adminUsersIdPut(
    id,
    adminUsersIdPutRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **adminUsersIdPutRequest** | **AdminUsersIdPutRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Updated |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden (not admin) |  -  |
|**404** | User not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminUsersPost**
> AdminUsersGet200ResponseInner adminUsersPost(adminUsersPostRequest)

Создание нового пользователя. Логин и пароль генерируются автоматически. Только для администратора.

### Example

```typescript
import {
    UsersApi,
    Configuration,
    AdminUsersPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let adminUsersPostRequest: AdminUsersPostRequest; //

const { status, data } = await apiInstance.adminUsersPost(
    adminUsersPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **adminUsersPostRequest** | **AdminUsersPostRequest**|  | |


### Return type

**AdminUsersGet200ResponseInner**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | User created |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden (not admin) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

