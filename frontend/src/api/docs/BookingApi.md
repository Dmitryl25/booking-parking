# BookingApi

All URIs are relative to *http://localhost:8080/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**bookingsIdDelete**](#bookingsiddelete) | **DELETE** /bookings/{id} | Cancel booking|
|[**bookingsMyGet**](#bookingsmyget) | **GET** /bookings/my | Get my bookings|
|[**bookingsPost**](#bookingspost) | **POST** /bookings | Create booking|
|[**bookingsSearchPost**](#bookingssearchpost) | **POST** /bookings/search | Search available parking|

# **bookingsIdDelete**
> bookingsIdDelete()

Отмена бронирования. Пользователь может отменить только свои бронирования.

### Example

```typescript
import {
    BookingApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BookingApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.bookingsIdDelete(
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
|**200** | Cancelled |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden (booking belongs to another user) |  -  |
|**404** | Booking not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **bookingsMyGet**
> Array<BookingsMyGet200ResponseInner> bookingsMyGet()

Получение списка бронирований текущего авторизованного пользователя.

### Example

```typescript
import {
    BookingApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BookingApi(configuration);

const { status, data } = await apiInstance.bookingsMyGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<BookingsMyGet200ResponseInner>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Booking list |  -  |
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **bookingsPost**
> bookingsPost(bookingsPostRequest)

Создание бронирования парковочного места на указанное время. Пользователь определяется по JWT токену.

### Example

```typescript
import {
    BookingApi,
    Configuration,
    BookingsPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new BookingApi(configuration);

let bookingsPostRequest: BookingsPostRequest; //

const { status, data } = await apiInstance.bookingsPost(
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
|**200** | Created |  -  |
|**400** | Invalid request (endTime before startTime) |  -  |
|**401** | Unauthorized |  -  |
|**404** | Spot not found |  -  |
|**409** | Spot already booked for this time |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **bookingsSearchPost**
> Array<BookingsSearchPost200ResponseInner> bookingsSearchPost(bookingsSearchPostRequest)

Поиск свободных парковочных мест в указанном офисе на заданный период времени.

### Example

```typescript
import {
    BookingApi,
    Configuration,
    BookingsSearchPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new BookingApi(configuration);

let bookingsSearchPostRequest: BookingsSearchPostRequest; //

const { status, data } = await apiInstance.bookingsSearchPost(
    bookingsSearchPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **bookingsSearchPostRequest** | **BookingsSearchPostRequest**|  | |


### Return type

**Array<BookingsSearchPost200ResponseInner>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Available spots |  -  |
|**400** | Invalid date range |  -  |
|**401** | Unauthorized |  -  |
|**404** | Office not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

