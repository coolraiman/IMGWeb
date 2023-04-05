import { observer } from "mobx-react-lite";
import React, { Fragment } from "react";
import { Tab } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";




export default observer(function ProfileData()
{
    const {userStore: {user}} = useStore();
    return (
        <Tab.Pane>
            <p>username: {user?.username}</p>
            <p>display name: {user?.displayName}</p>
            <p>space used: {user?.spaceUsed}</p>
            <p>space allowed: {user?.spaceAllowed}</p>
        </Tab.Pane>
    )
})