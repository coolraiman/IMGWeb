import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Container, Grid, Header } from "semantic-ui-react";
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
    const {searchResult, deleteMultiSelectImageList, editSearchResult, loading} = imageStore;
    const {getSettings} = userStore;

    const [multiSelectImages, setMultiSelectImages] = useState(new Map<string, ImageData>())
    const [imagesList, setImagesList] = useState<ImageData[]>(searchResult)
    const [selectedImage, setSelectedImage] = useState<ImageData | null>(null)
    const [searched, setSearched] = useState<boolean>(false);

    useEffect(() => {
        if (searchResult.length !== imagesList.length) {
            setImagesList(searchResult);
        }
    }, [searchResult.length, imagesList.length]);

    const onMultiSelectImages = (images: Map<string,ImageData>): void =>
    {
        setMultiSelectImages(images);
    }

    const onSelectImage = (image: ImageData): void => {
        setSelectedImage(image);
    }

    const unSelectImage = (index: ImageData) => {
        setSelectedImage(null);
        onMultiSelectImages(new Map<string, ImageData>().set(index.id, index));
    }

    const onClickDeleteSelected = () => {
        if((multiSelectImages.size === 1 && !getSettings().deleteImage) || !getSettings().deleteMultiImage)
        {
            confirmDeleteSelected();
        }
        else
        {
            modalStore.openModal(
                <ConfirmationMessage
                    message={`Do you want to delete every images from the selection?`}
                    positiveButton="Delete" negativeButton="Cancel" rememberBox
                    settingName={(multiSelectImages.size === 1) ? SettingName.DeleteImage : SettingName.DeleteMultiImage}
                    func={confirmDeleteSelected} args={[]}
                />
            )
        }
    }

    const confirmDeleteSelected = () =>
    {
        deleteMultiSelectImageList(multiSelectImages);
        editSearchResult(searchResult.filter(x => !multiSelectImages.has(x.id)));
        setMultiSelectImages(new Map<string, ImageData>());
    }

    const onDeleteDetails = (img: ImageData) => {
        editSearchResult(searchResult.filter(x => x.id !== img.id));
        if(searchResult.length === 0)
        {
            setSelectedImage(null);
        }

        setImagesList(searchResult);
    }

    const onSort = (imgs : ImageData[]) =>
    {
        setImagesList(imgs);
    }

    const onSearch = () => {
        setSearched(true);
    }

    return (
        <Container id="image_search_page">
            {(selectedImage && searchResult.length > 0) ?
                <ImageDetails images={imagesList} clickedImage={selectedImage} exit={unSelectImage} onDelete={onDeleteDetails}/>
            :
            <Grid padded={true}>
                <Grid.Row style={{ margin: 0, padding: 0 }}>
                    <Grid.Column width={3}  style={{ margin: 0, padding: 0 }}>
                        <ImageSearchMenu onSearch={onSearch}/>
                    </Grid.Column>
                    <Grid.Column  width={9} style={{ margin: 0, padding: 0 }}>
                        <Grid.Row>
                            <ImageSortBar images={imagesList} onSort={onSort}/>
                        </Grid.Row>
                        <Grid.Row>
                        {(searched && searchResult.length === 0 && !loading) ?
                            <Header as='h1' textAlign="center">No image found</Header>
                            :
                            <ImagesGrid images={imagesList} multiSelectMode
                                onSelect={onSelectImage}
                                onMultiSelect={onMultiSelectImages}/>
                            }
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