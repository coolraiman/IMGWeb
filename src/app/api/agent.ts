import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { Tag } from "../models/tag";
import { User, UserFormValues } from "../models/user";
import { router } from "../router/Routes";
import { store } from "../stores/store";

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = "http://localhost:5100/api"

const responseBody = <T> (response: AxiosResponse<T>) => response.data;
//intercept every request, add token to request
axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    if(token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

//intercept every response
axios.interceptors.response.use(async response => {
    await sleep(1000);
    return response;
}, (error: AxiosError) => {
    const {data,status, config} = error.response as AxiosResponse;
    switch (status) {
        case 400:
            if(config.method === 'get' && data.errors.hasOwnProperty('id')) {
                router.navigate('/not-found');
            }
            if(data.errors)
            {
                const modalStateErrors = [];
                for(const key in data.errors)
                {
                    if(data.errors[key])
                    {
                        modalStateErrors.push(data.errors[key]);
                    }
                }
                throw modalStateErrors.flat();
            } else {
                toast.error(data);
            }
            break;
        case 401:
            toast.error('unauthorised');
            break;
        case 403:
            toast.error('forbidden');
            break;
        case 404:
            router.navigate('/not-found');
            break;
        case 500:
            store.commonStore.setServerError(data);
            router.navigate('/server-error');
            break;
    }
    return Promise.reject(error);
})



const requests = {
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
    post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T> (url: string) => axios.delete<T>(url).then(responseBody),
}

const Tags = {
    list: () => requests.get<Tag[]>('tags'),
    details: (id: string) => requests.get<Tag>(`/tags/${id}`),
    create: (activity: Tag) => axios.post<void>('/tags', activity),
    update: (activity: Tag) => axios.put<void>(`/tags/${activity.id}`, activity),
    delete: (id: string) => axios.delete<void>(`/tags/${id}`),
}

const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user)
}

const agent = {
    Tags,
    Account
}

export default agent;