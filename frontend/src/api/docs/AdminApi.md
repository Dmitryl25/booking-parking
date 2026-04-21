# AdminApi

All URIs are relative to *http://localhost:8080/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**adminBookingsForcePost**](#adminbookingsforcepost) | **POST** /admin/bookings/force | Spot blocking|
|[**adminGeneratePasswordPost**](#admingeneratepasswordpost) | **POST** /admin/generate-password | Generate random password|
|[**adminOfficesIdDelete**](#adminofficesiddelete) | **DELETE** /admin/offices/{id} | Delete office|
|[**adminOfficesIdPut**](#adminofficesidput) | **PUT** /admin/offices/{id} | Update office|
|[**adminOfficesOfficeIdCategoriesIdDelete**](#adminofficesofficeidcategoriesiddelete) | **DELETE** /admin/offices/{officeId}/categories/{id} | Delete category|
|[**adminOfficesOfficeIdCategoriesIdPut**](#adminofficesofficeidcategoriesidput) | **PUT** /admin/offices/{officeId}/categories/{id} | Update category|
|[**adminOfficesOfficeIdCategoriesPost**](#adminofficesofficeidcategoriespost) | **POST** /admin/offices/{officeId}/categories | Create category|
|[**adminOfficesOfficeIdParkingSpotsGet**](#adminofficesofficeidparkingspotsget) | **GET** /admin/offices/{officeId}/parking-spots | Get parking spots|
|[**adminOfficesPost**](#adminofficespost) | **POST** /admin/offices | Create office|
|[**adminParkingSpotsDeletePost**](#adminparkingspotsdeletepost) | **POST** /admin/parking-spots/delete | Delete parking spot|
|[**adminParkingSpotsPost**](#adminparkingspotspost) | **POST** /admin/parking-spots | Create parking spot|
|[**adminUsersGet**](#adminusersget) | **GET** /admin/users | Get all users|
|[**adminUsersIdDelete**](#adminusersiddelete) | **DELETE** /admin/users/{id} | Delete user|
|[**adminUsersIdPut**](#adminusersidput) | **PUT** /admin/users/{id} | Update user|
|[**adminUsersIdResetPasswordPost**](#adminusersidresetpasswordpost) | **POST** /admin/users/{id}/reset-password | Reset user password|
|[**adminUsersPost**](#adminuserspost) | **POST** /admin/users | Create user|

# **adminBookingsForcePost**
> adminBookingsForcePost(bookingsPostRequest)

Блокирование места.

### Example

```typescript
import {
    AdminApi,
    Configuration,
    BookingsPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

let bookingsPostRequest: BookingsPostRequest; //

const { status, data } = await apiInstance.adminBookingsForcePost(
    bookingsPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **bookingsPostRequest** | **BookingsPostRequest**|  | |


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
|**200** | Blocked |  -  |
|**400** | Invalid request |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden (not admin) |  -  |
|**404** | Spot not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminGeneratePasswordPost**
> AdminGeneratePasswordPost200Response adminGeneratePasswordPost()

Генерация случайного пароля на сервере

### Example

```typescript
import {
    AdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

const { status, data } = await apiInstance.adminGeneratePasswordPost();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**AdminGeneratePasswordPost200Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Password generated |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden (not admin) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminOfficesIdDelete**
> adminOfficesIdDelete()

Удаление офиса. Только для администратора.

### Example

```typescript
import {
    AdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.adminOfficesIdDelete(
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
|**404** | Office not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminOfficesIdPut**
> adminOfficesIdPut(adminOfficesPostRequest)

Обновление адреса офиса. Только для администратора.

### Example

```typescript
import {
    AdminApi,
    Configuration,
    AdminOfficesPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

let id: number; // (default to undefined)
let adminOfficesPostRequest: AdminOfficesPostRequest; //

const { status, data } = await apiInstance.adminOfficesIdPut(
    id,
    adminOfficesPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **adminOfficesPostRequest** | **AdminOfficesPostRequest**|  | |
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
|**404** | Office not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminOfficesOfficeIdCategoriesIdDelete**
> adminOfficesOfficeIdCategoriesIdDelete()

Удаление категории. Только для администратора (удаляются и все места, связанные с ней).

### Example

```typescript
import {
    AdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

let officeId: number; // (default to undefined)
let id: number; // (default to undefined)

const { status, data } = await apiInstance.adminOfficesOfficeIdCategoriesIdDelete(
    officeId,
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **officeId** | [**number**] |  | defaults to undefined|
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
|**404** | Category not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminOfficesOfficeIdCategoriesIdPut**
> adminOfficesOfficeIdCategoriesIdPut(adminOfficesOfficeIdCategoriesIdPutRequest)

Обновление категории. Только для администратора.

### Example

```typescript
import {
    AdminApi,
    Configuration,
    AdminOfficesOfficeIdCategoriesIdPutRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

let officeId: number; //ID офиса (default to undefined)
let id: number; //Номер категории (default to undefined)
let adminOfficesOfficeIdCategoriesIdPutRequest: AdminOfficesOfficeIdCategoriesIdPutRequest; //

const { status, data } = await apiInstance.adminOfficesOfficeIdCategoriesIdPut(
    officeId,
    id,
    adminOfficesOfficeIdCategoriesIdPutRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **adminOfficesOfficeIdCategoriesIdPutRequest** | **AdminOfficesOfficeIdCategoriesIdPutRequest**|  | |
| **officeId** | [**number**] | ID офиса | defaults to undefined|
| **id** | [**number**] | Номер категории | defaults to undefined|


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
|**404** | Office not found |  -  |
|**409** | Category with this name already exists in this office |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminOfficesOfficeIdCategoriesPost**
> adminOfficesOfficeIdCategoriesPost(adminOfficesOfficeIdCategoriesPostRequest)

Создание новой категории парковочных мест для указанного офиса. Только для администратора.

### Example

```typescript
import {
    AdminApi,
    Configuration,
    AdminOfficesOfficeIdCategoriesPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

let officeId: number; // (default to undefined)
let adminOfficesOfficeIdCategoriesPostRequest: AdminOfficesOfficeIdCategoriesPostRequest; //

const { status, data } = await apiInstance.adminOfficesOfficeIdCategoriesPost(
    officeId,
    adminOfficesOfficeIdCategoriesPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **adminOfficesOfficeIdCategoriesPostRequest** | **AdminOfficesOfficeIdCategoriesPostRequest**|  | |
| **officeId** | [**number**] |  | defaults to undefined|


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
|**201** | Created |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden (not admin) |  -  |
|**404** | Office not found |  -  |
|**409** | Category already exists in this office |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminOfficesOfficeIdParkingSpotsGet**
> Array<AdminOfficesOfficeIdParkingSpotsGet200ResponseInner> adminOfficesOfficeIdParkingSpotsGet()

Получение списка всех парковочных мест в указанном офисе. Только для администратора.

### Example

```typescript
import {
    AdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

let officeId: number; // (default to undefined)

const { status, data } = await apiInstance.adminOfficesOfficeIdParkingSpotsGet(
    officeId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **officeId** | [**number**] |  | defaults to undefined|


### Return type

**Array<AdminOfficesOfficeIdParkingSpotsGet200ResponseInner>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Parking spots list |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden (not admin) |  -  |
|**404** | Office not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminOfficesPost**
> OfficesGet200ResponseInner adminOfficesPost(adminOfficesPostRequest)

Создание нового офиса. Только для администратора.

### Example

```typescript
import {
    AdminApi,
    Configuration,
    AdminOfficesPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

let adminOfficesPostRequest: AdminOfficesPostRequest; //

const { status, data } = await apiInstance.adminOfficesPost(
    adminOfficesPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **adminOfficesPostRequest** | **AdminOfficesPostRequest**|  | |


### Return type

**OfficesGet200ResponseInner**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Office created |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden (not admin) |  -  |
|**409** | Office with this address already exists |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminParkingSpotsDeletePost**
> adminParkingSpotsDeletePost(adminParkingSpotsPostRequest)

Удаление парковочного места. Только для администратора.

### Example

```typescript
import {
    AdminApi,
    Configuration,
    AdminParkingSpotsPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

let adminParkingSpotsPostRequest: AdminParkingSpotsPostRequest; //

const { status, data } = await apiInstance.adminParkingSpotsDeletePost(
    adminParkingSpotsPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **adminParkingSpotsPostRequest** | **AdminParkingSpotsPostRequest**|  | |


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
|**200** | Deleted |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden (not admin) |  -  |
|**404** | Spot not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminParkingSpotsPost**
> adminParkingSpotsPost(adminParkingSpotsPostRequest)

Создание нового парковочного места. Только для администратора.

### Example

```typescript
import {
    AdminApi,
    Configuration,
    AdminParkingSpotsPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

let adminParkingSpotsPostRequest: AdminParkingSpotsPostRequest; //

const { status, data } = await apiInstance.adminParkingSpotsPost(
    adminParkingSpotsPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **adminParkingSpotsPostRequest** | **AdminParkingSpotsPostRequest**|  | |


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
|**201** | Created |  -  |
|**400** | Invalid request |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden (not admin) |  -  |
|**404** | Office or category not found |  -  |
|**409** | Spot with such number already exists in this office |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminUsersGet**
> Array<AdminUsersGet200ResponseInner> adminUsersGet()

Получение списка всех зарегистрированных пользователей. Только для администратора.

### Example

```typescript
import {
    AdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

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
    AdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

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
    AdminApi,
    Configuration,
    AdminUsersIdPutRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

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

# **adminUsersIdResetPasswordPost**
> AdminUsersIdResetPasswordPost200Response adminUsersIdResetPasswordPost()

Сброс пароля пользователя. Генерируется новый пароль и возвращается администратору.

### Example

```typescript
import {
    AdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.adminUsersIdResetPasswordPost(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**AdminUsersIdResetPasswordPost200Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Password reset successfully |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden (not admin) |  -  |
|**404** | User not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminUsersPost**
> adminUsersPost(adminUsersPostRequest)

Создание нового пользователя. Пароль генерируется автоматически.

### Example

```typescript
import {
    AdminApi,
    Configuration,
    AdminUsersPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

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

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | User created |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden (not admin) |  -  |
|**409** | User with this email already exists |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

