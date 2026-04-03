# OfficesApi

All URIs are relative to *http://localhost:8080/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**adminOfficesIdDelete**](#adminofficesiddelete) | **DELETE** /admin/offices/{id} | Delete office|
|[**adminOfficesIdPut**](#adminofficesidput) | **PUT** /admin/offices/{id} | Update office|
|[**adminOfficesPost**](#adminofficespost) | **POST** /admin/offices | Create office|
|[**officesGet**](#officesget) | **GET** /offices | Get offices|

# **adminOfficesIdDelete**
> adminOfficesIdDelete()

Удаление офиса. Только для администратора.

### Example

```typescript
import {
    OfficesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OfficesApi(configuration);

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
    OfficesApi,
    Configuration,
    AdminOfficesPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new OfficesApi(configuration);

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

# **adminOfficesPost**
> adminOfficesPost(adminOfficesPostRequest)

Создание нового офиса. Только для администратора.

### Example

```typescript
import {
    OfficesApi,
    Configuration,
    AdminOfficesPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new OfficesApi(configuration);

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
|**401** | Unauthorized |  -  |
|**403** | Forbidden (not admin) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **officesGet**
> Array<OfficesGet200ResponseInner> officesGet()

Получение списка всех офисов.

### Example

```typescript
import {
    OfficesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OfficesApi(configuration);

const { status, data } = await apiInstance.officesGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<OfficesGet200ResponseInner>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Offices list |  -  |
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

