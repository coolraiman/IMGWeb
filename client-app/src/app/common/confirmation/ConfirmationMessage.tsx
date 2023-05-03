
import React, { useState } from 'react';
import { Button, Checkbox, Grid, Header, Segment } from 'semantic-ui-react';
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
                    <Header textAlign='center'>{props.message}</Header>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={3}/>
                    <Grid.Column width={3}>
                        <Button  key={"confirm"} content={props.positiveButton} negative onClick={() => handleConfirm()}/>
                    </Grid.Column>
                    <Grid.Column width={2}/>
                    <Grid.Column width={3}>
                        <Button  key={"cancel"} content={props.negativeButton} positive onClick={() => handleCancel()}/>
                    </Grid.Column>
                    <Grid.Column width={3}/>
                </Grid.Row>
                { props.rememberBox && 
                    <Grid.Row>
                        <Grid.Column width={3}/>
                        <Grid.Column width={2}>
                            <Checkbox name='confirmBox' id={'confirmBox'} onChange={(e) => handleChange()}/>
                        </Grid.Column>
                        <Grid.Column width={9}>
                            <p>Do not ask again</p>
                        </Grid.Column>
                    </Grid.Row>
                }
            </Grid>
        </Segment>
    )
}