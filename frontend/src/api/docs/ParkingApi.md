# ParkingApi

All URIs are relative to *http://localhost:8080/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**adminOfficesOfficeIdParkingSpotsGet**](#adminofficesofficeidparkingspotsget) | **GET** /admin/offices/{officeId}/parking-spots | Get parking spots|
|[**adminParkingSpotsIdDelete**](#adminparkingspotsiddelete) | **DELETE** /admin/parking-spots/{id} | Delete parking spot|
|[**adminParkingSpotsIdStatusPatch**](#adminparkingspotsidstatuspatch) | **PATCH** /admin/parking-spots/{id}/status | Update parking spot status|
|[**adminParkingSpotsPost**](#adminparkingspotspost) | **POST** /admin/parking-spots | Create parking spot|

# **adminOfficesOfficeIdParkingSpotsGet**
> Array<AdminOfficesOfficeIdParkingSpotsGet200ResponseInner> adminOfficesOfficeIdParkingSpotsGet()

Получение списка всех парковочных мест в указанном офисе. Только для администратора.

### Example

```typescript
import {
    ParkingApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ParkingApi(configuration);

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

# **adminParkingSpotsIdDelete**
> adminParkingSpotsIdDelete()

Удаление парковочного места. Только для администратора.

### Example

```typescript
import {
    ParkingApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ParkingApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.adminParkingSpotsIdDelete(
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
|**404** | Spot not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminParkingSpotsIdStatusPatch**
> AdminParkingSpotsIdStatusPatch200Response adminParkingSpotsIdStatusPatch(adminParkingSpotsIdStatusPatchRequest)

Изменение статуса парковочного места (доступно/заблокировано). Только для администратора.

### Example

```typescript
import {
    ParkingApi,
    Configuration,
    AdminParkingSpotsIdStatusPatchRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ParkingApi(configuration);

let id: number; //ID парковочного места (default to undefined)
let adminParkingSpotsIdStatusPatchRequest: AdminParkingSpotsIdStatusPatchRequest; //

const { status, data } = await apiInstance.adminParkingSpotsIdStatusPatch(
    id,
    adminParkingSpotsIdStatusPatchRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **adminParkingSpotsIdStatusPatchRequest** | **AdminParkingSpotsIdStatusPatchRequest**|  | |
| **id** | [**number**] | ID парковочного места | defaults to undefined|


### Return type

**AdminParkingSpotsIdStatusPatch200Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Status updated |  -  |
|**400** | Invalid request |  -  |
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
    ParkingApi,
    Configuration,
    AdminParkingSpotsPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ParkingApi(configuration);

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
|**200** | Created |  -  |
|**400** | Invalid request |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden (not admin) |  -  |
|**404** | Office or category not found |  -  |
|**409** | Spot with such number already exists in this office |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

