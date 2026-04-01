# CommonApi

All URIs are relative to *http://localhost:8080/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**officesGet**](#officesget) | **GET** /offices | Get offices|
|[**officesOfficeIdCategoriesGet**](#officesofficeidcategoriesget) | **GET** /offices/{officeId}/categories | Get categories|

# **officesGet**
> Array<OfficesGet200ResponseInner> officesGet()

Получение списка всех офисов.

### Example

```typescript
import {
    CommonApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CommonApi(configuration);

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

# **officesOfficeIdCategoriesGet**
> Array<OfficesOfficeIdCategoriesGet200ResponseInner> officesOfficeIdCategoriesGet()

Получение списка категорий парковочных мест для указанного офиса.

### Example

```typescript
import {
    CommonApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CommonApi(configuration);

let officeId: number; // (default to undefined)

const { status, data } = await apiInstance.officesOfficeIdCategoriesGet(
    officeId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **officeId** | [**number**] |  | defaults to undefined|


### Return type

**Array<OfficesOfficeIdCategoriesGet200ResponseInner>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Categories list |  -  |
|**401** | Unauthorized |  -  |
|**404** | Office not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

