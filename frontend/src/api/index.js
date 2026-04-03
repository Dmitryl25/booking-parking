import * as ApiModules from './api';
import axiosInstance from './axios';

const config = ApiModules.Configuration 
  ? new ApiModules.Configuration({ basePath: 'http://localhost:8080' }) 
  : { basePath: 'http://localhost:8080' };

export const authApi = new ApiModules.AuthApi(config, undefined, axiosInstance);
export const userApi = new ApiModules.UserApi(config, undefined, axiosInstance);
export const adminApi = new ApiModules.AdminApi(config, undefined, axiosInstance);
export const commonApi = new ApiModules.CommonApi(config, undefined, axiosInstance);