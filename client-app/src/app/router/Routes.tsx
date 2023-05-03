import { RouteObject } from "react-router";
import { createBrowserRouter, Navigate } from "react-router-dom";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";
import ImageSearchPage from "../../features/images/ImageSearchPage";
import ProfilePage from "../../features/profiles/ProfilePage";
import TagManager from "../../features/tags/TagManager";
import ImageUploadWidget from "../../features/upload/ImageUploadWidget";
import LoginForm from "../../features/users/LoginForm";
import App from "../layout/App";
import RequireAuth from "./RequireAuth";

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App/>,
        children: [
            {element: <RequireAuth/>, children: [
                {path: 'profile', element: <ProfilePage />},
                {path: 'login', element: <LoginForm/>},
                {path: 'tags', element: <TagManager/>},
                {path: 'images', element: <ImageSearchPage/>},
                {path: 'upload', element: <ImageUploadWidget/>},
            ]},
            {path: 'not-found', element: <NotFound/>},
            {path: 'server-error', element: <ServerError/>},
            {path: '*', element: <Navigate replace to='/not-found'/>},
        ]
    }
]

export const router = createBrowserRouter(routes);