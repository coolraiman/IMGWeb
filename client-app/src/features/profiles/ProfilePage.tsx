import { observer } from "mobx-react-lite";
import React, { Fragment } from "react";
import { useStore } from "../../app/stores/store";



export default observer(function ProfileCard()
{
    const {userStore: {user}} = useStore();
    return (
        <Fragment>
            <p>username: {user?.username}</p>
            <p>display name: {user?.displayName}</p>
            <p>space used: {user?.spaceUsed}</p>
            <p>space allowed: {user?.spaceAllowed}</p>
        </Fragment>
    )
})