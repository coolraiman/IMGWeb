
import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { Button, Checkbox, Grid, Header, Label, Segment } from 'semantic-ui-react';
import { SettingName } from '../../models/userSettings';
import { useStore } from '../../stores/store';

interface Props<F extends (...args: any[]) => any> {
    message: string;
    positiveButton: string;
    negativeButton: string;
    rememberBox: boolean;
    settingName?: SettingName;
    func: F;
    args: Parameters<F>;
  }

export default function ConfirmationMessage<F extends (...args: any[]) => any>(props: Props<F>) {
    const {modalStore, userStore} = useStore();
    const {setSetting} = userStore;
    const [remember, setRemember] = useState(false);

    const handleChange = () => {
        setRemember(!remember);
    }

    const handleConfirm = () => {
        if(props.rememberBox && props.settingName && remember)
        {
            console.log("set settings")
            setSetting(props.settingName, !remember);
        }
        props.func(...props.args);
        modalStore.closeModal();
    }

    const handleCancel = () => {

        modalStore.closeModal();
    }



    return (
        <Segment>
            <Grid>
                <Grid.Row key={"header"}>
                    <Header>{props.message}</Header>
                </Grid.Row>
                <Grid.Row>
                    <Button.Group>
                        <Button floated='left' key={"confirm"} content={props.positiveButton} positive onClick={() => handleConfirm()}/>
                        <Button floated='right' key={"cancel"} content={props.negativeButton} negative onClick={() => handleCancel()}/>
                    </Button.Group>
                </Grid.Row>
                { props.rememberBox && 
                    <Grid.Row>
                        <Label>Do not ask again</Label>
                        <Checkbox name='confirmBox' id={'confirmBox'} onChange={(e) => handleChange()}/>
                    </Grid.Row>
                }
                
            </Grid>
        </Segment>
    )
}