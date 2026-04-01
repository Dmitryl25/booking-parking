# CategoriesApi

All URIs are relative to *http://localhost:8080/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**adminCategoriesIdDelete**](#admincategoriesiddelete) | **DELETE** /admin/categories/{id} | Delete category|
|[**adminOfficesOfficeIdCategoriesPost**](#adminofficesofficeidcategoriespost) | **POST** /admin/offices/{officeId}/categories | Create category|
|[**officesOfficeIdCategoriesGet**](#officesofficeidcategoriesget) | **GET** /offices/{officeId}/categories | Get categories|

# **adminCategoriesIdDelete**
> adminCategoriesIdDelete()

Удаление категории. Только для администратора (удаляются и все места, связанные с ней).

### Example

```typescript
import {
    CategoriesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoriesApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.adminCategoriesIdDelete(
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
|**404** | Category not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminOfficesOfficeIdCategoriesPost**
> adminOfficesOfficeIdCategoriesPost(adminOfficesOfficeIdCategoriesPostRequest)

Создание новой категории парковочных мест для указанного офиса. Только для администратора.

### Example

```typescript
import {
    CategoriesApi,
    Configuration,
    AdminOfficesOfficeIdCategoriesPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoriesApi(configuration);

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
|**200** | Created |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden (not admin) |  -  |
|**404** | Office not found |  -  |
|**409** | Category already exists in this office |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **officesOfficeIdCategoriesGet**
> Array<OfficesOfficeIdCategoriesGet200ResponseInner> officesOfficeIdCategoriesGet()

Получение списка категорий парковочных мест для указанного офиса.

### Example

```typescript
import {
    CategoriesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoriesApi(configuration);

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

