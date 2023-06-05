import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Button, Checkbox, Divider, Header, Label, Tab } from "semantic-ui-react";
import { UserSettings } from "../../../app/models/userSettings";
import { useStore } from "../../../app/stores/store";
import { toast } from "react-toastify";



export default observer(function ProfileSettings()
{
    const {userStore: {getSettings, setSettings}} = useStore();
    const baseSettings = getSettings();
    const [removeTag, setRemoveTag] = useState(baseSettings.deleteTag);
    const [removeMultiTag, setRemoveMultiTag] = useState(baseSettings.deleteMultiTags);
    const [deleteImage, setDeleteImage] = useState(baseSettings.deleteImage);
    const [deleteMultiImage, setDeleteMultiImage] = useState(baseSettings.deleteMultiImage);

    const saveChanges = () => {
        const settings: UserSettings = {
            deleteTag: removeTag, deleteMultiTags: removeMultiTag, 
            deleteImage: deleteImage, deleteMultiImage: deleteMultiImage
        };
        setSettings(settings);
        toast.success("Settings saved successfully");
    }

    return (
        <Tab.Pane>
            <Header>Warnings when</Header>
            <Label>Remove Tag</Label> <Checkbox checked={removeTag} onChange={() => {setRemoveTag(!removeTag)}}/>
            <br/>
            <Label>Remove Multiple Tags</Label> <Checkbox checked={removeMultiTag} onChange={() => {setRemoveMultiTag(!removeMultiTag)}}/>
            <br/>
            <Label>Delete Image</Label> <Checkbox checked={deleteImage} onChange={() => {setDeleteImage(!deleteImage)}}/>
            <br/>
            <Label>Delete Multiple Images</Label> <Checkbox checked={deleteMultiImage} onChange={() => {setDeleteMultiImage(!deleteMultiImage)}}/>
            <Divider/>
            <Button primary onClick={() => saveChanges()}>Save Changes</Button>
        </Tab.Pane>
    )
})