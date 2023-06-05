import { observer } from "mobx-react-lite";
import { Tab } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";

export default observer(function ProfileData()
{
    const {userStore: {user}} = useStore();
    return (
        <Tab.Pane>
            <p>display name: {user?.displayName}</p>
            <p>space used: {user?.spaceUsed}</p>
        </Tab.Pane>
    )
})