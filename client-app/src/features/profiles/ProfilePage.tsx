import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Grid, Tab } from "semantic-ui-react";
import ProfileData from "./panes/ProfileData";
import ProfileSettings from "./panes/ProfileSettings";



export default observer(function ProfileCard()
{
    const [activeIndex, setActiveIndex] = useState(0);

    const handleTabChange = (index: number) => {
        setActiveIndex(index);
    };

    const panes = [
        {menuItem: 'Profile', render: () => <ProfileData/>},
        {menuItem: 'Settings', render: () => <ProfileSettings/>}
    ]

    return (
        <Grid>
            <Grid.Column width={16}>
                    <Tab
                        menu={{fluid: true, vertical: true, tabular: true}}
                        menuPosition='left'
                        panes={panes}
                        activeIndex={activeIndex}
                        onTabChange={(e, { activeIndex }) => handleTabChange(activeIndex as number)}
                        key={activeIndex}
                    />
            </Grid.Column>
        </Grid>
    )
})