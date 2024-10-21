import { hexToUtf8 } from './crypt';
import axios, { AxiosResponse } from 'axios';

export const request = async (hexUrl: any, data: any, headers: any): Promise<AxiosResponse> => {
    return axios.post(hexToUtf8(hexUrl), { data }, { headers });
};
