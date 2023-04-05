import { observer } from "mobx-react-lite";
import { Fragment, useState } from "react";
import { Container, Grid, Segment } from "semantic-ui-react";
import { Tag } from "../../app/models/tag";
import { ImageData } from "../../app/models/imageData";
import { useStore } from "../../app/stores/store";
import ImageDetails from "./ImageDetails";
import ImageSearchMenu from "./ImageSearchMenu";
import ImagesGrid from "./ImagesGrid";
import ImageSortBar from "./ImageSortBar";
import MultiSelectsMenu from "./MultiSelectsMenu";
import ConfirmationMessage from "../../app/common/confirmation/ConfirmationMessage";
import { SettingName } from "../../app/models/userSettings";

export default observer(function ImageSearchPage()
{
    const {imageStore, userStore, modalStore} = useStore();
    const {selectedImage, searchResult, deleteMultiSelectImageList, editSearchResult} = imageStore;
    const {getSettings} = userStore;

    const [multiSelectImages, setMultiSelectImages] = useState(new Map<string, ImageData>())

    const onMultiSelectImages = (images: Map<string,ImageData>): void =>
    {
        setMultiSelectImages(images);
    }

    const onSelectImage = (image: ImageData): void => {

    }

    const onClickDeleteSelected = () => {
        console.log(multiSelectImages.size)
        if((multiSelectImages.size === 1 && !getSettings().deleteImage) || !getSettings().deleteMultiImage)
        {
            deleteMultiSelectImageList(multiSelectImages);
        }
        else
        {
            modalStore.openModal(
                <ConfirmationMessage
                    message={`Do you want to delete every images from the selection?`}
                    positiveButton="Delete" negativeButton="Cancel" rememberBox
                    settingName={(multiSelectImages.size === 1) ? SettingName.DeleteImage : SettingName.DeleteMultiImage}
                    func={deleteMultiSelectImageList} args={[multiSelectImages]}
                />
            )
        }
        editSearchResult(searchResult.filter(x => !multiSelectImages.has(x.id)));
        setMultiSelectImages(new Map<string, ImageData>());
    }

    return (
        <Container id="image_search_page">
            {selectedImage ?
                <ImageDetails/>
            :
            <Grid padded={true}>
                <Grid.Row style={{ margin: 0, padding: 0 }}>
                    <Grid.Column width={3}  style={{ margin: 0, padding: 0 }}>
                        <ImageSearchMenu/>
                    </Grid.Column>
                    <Grid.Column  width={9} style={{ margin: 0, padding: 0 }}>
                        <Grid.Row>
                            <ImageSortBar/>
                        </Grid.Row>
                        <Grid.Row>
                            <ImagesGrid images={searchResult} multiSelectMode detailsMode 
                                onSelect={onSelectImage}
                                onMultiSelect={onMultiSelectImages}/>
                        </Grid.Row>
                    </Grid.Column>
                    <Grid.Column width={3}>
                    {(multiSelectImages.size > 0) &&
                        <MultiSelectsMenu multiSelect={multiSelectImages} onDeleteSelection={onClickDeleteSelected}/>
                    }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            }
        </Container>
    )
})