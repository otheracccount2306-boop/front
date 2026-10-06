import { Platform } from 'react-native';

const defaultUrl = Platform.select({
  android: 'http://10.0.2.2:8080/api/v1',
  default: 'http://localhost:8080/api/v1',
});

export const API_BASE_URL = process.env.API_BASE_URL ? process.env.API_BASE_URL : defaultUrl;
