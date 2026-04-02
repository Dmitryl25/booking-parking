# AuthApi

All URIs are relative to *http://localhost:8080/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**authLoginPost**](#authloginpost) | **POST** /auth/login | Login user or admin|
|[**authRefreshPost**](#authrefreshpost) | **POST** /auth/refresh | Refresh access token|

# **authLoginPost**
> AuthLoginPost200Response authLoginPost(authLoginPostRequest)

Аутентификация пользователя или администратора по email и паролю. Возвращает access и refresh токены для последующих запросов и роль пользователя.

### Example

```typescript
import {
    AuthApi,
    Configuration,
    AuthLoginPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let authLoginPostRequest: AuthLoginPostRequest; //

const { status, data } = await apiInstance.authLoginPost(
    authLoginPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **authLoginPostRequest** | **AuthLoginPostRequest**|  | |


### Return type

**AuthLoginPost200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful login |  -  |
|**401** | Invalid credentials |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authRefreshPost**
> AuthRefreshPost200Response authRefreshPost(authRefreshPostRequest)

Обновление access токена с использованием refresh токена. Возвращает новую пару токенов.

### Example

```typescript
import {
    AuthApi,
    Configuration,
    AuthRefreshPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let authRefreshPostRequest: AuthRefreshPostRequest; //

const { status, data } = await apiInstance.authRefreshPost(
    authRefreshPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **authRefreshPostRequest** | **AuthRefreshPostRequest**|  | |


### Return type

**AuthRefreshPost200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Tokens refreshed successfully |  -  |
|**400** | Пропущен рефреш-токен или передан null |  -  |
|**401** | Неверный или истекший рефреш-токен |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

