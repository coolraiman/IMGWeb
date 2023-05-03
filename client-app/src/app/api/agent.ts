import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { Profile } from "../models/profile";
import { Tag, TagFormValues } from "../models/tag";
import { ImageData } from "../models/imageData";
import { SearchDto } from "../dtos/searchDto";
import { User, UserFormValues } from "../models/user";
import { router } from "../router/Routes";
import { store } from "../stores/store";
import { NumberDto } from "../dtos/numberDto";
import { TagImageDto } from "../dtos/tagImageDto";

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const responseBody = <T> (response: AxiosResponse<T>) => response.data;
//intercept every request, add token to request
axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    if(token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

//intercept every response
axios.interceptors.response.use(async response => {
    if(process.env.NODE_ENV === 'development') await sleep(500);
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
            router.navigate('/');
            break;
        case 403:
            toast.error('forbidden');
            router.navigate('/');
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
    details: (id: number) => requests.get<Tag>(`/tags/${id}`),
    create: (tagForm: TagFormValues) => axios.post<void>('/tags', tagForm),
    update: (tagForm: TagFormValues) => axios.put<void>(`/tags/${tagForm.id}`, tagForm),
    delete: (id: number) => axios.delete<void>(`/tags/${id}`),
}

const Images = {
    search: (searchParams : SearchDto) => axios.post<ImageData[]>(`/images/search`, searchParams),
    updateRating: (rating : NumberDto, imgId : string) => axios.put<void>(`/images/updaterating/${imgId}`, rating),
    updateFavorite: (imgId : string) => axios.put<void>(`/images/updatefavorite/${imgId}`),
    addView: (imgId : string) => axios.put<void>(`/images/addview/${imgId}`),
    deleteImage: (imgId : string) => axios.delete<void>(`/images/${imgId}`),
    uploadImage: (file: Blob) => {
        let formData = new FormData();
        formData.append('File', file);
        return axios.post<ImageData>('images', formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        })
    }
}

const TagImages = {
    addTag: (tagImage : TagImageDto) => axios.post<void>(`/tagImage`, tagImage),
    removeTag: (tagImage : TagImageDto) => axios.post<void>(`/tagImage/remove`, tagImage)
}

const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user)
}

const Profiles = {
    current: () => requests.get<Profile>('/profiles')
}

const agent = {
    Tags,
    Images,
    Account,
    Profiles,
    TagImages
}

export default agent;