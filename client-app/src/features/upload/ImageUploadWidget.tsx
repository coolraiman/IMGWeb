import React, { Fragment, ReactElement, useEffect, useState } from "react";
import { Button, Container, Grid, GridColumn, Header, Image } from "semantic-ui-react";
import ImageDropZone from "./ImageDropZone";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../../app/layout/loadingComponent";
import { ImageData } from "../../app/models/imageData";
import ImageDetails from "../images/ImageDetails";
import ImageSortBar from "../images/ImageSortBar";
import ImagesGrid from "../images/ImagesGrid";
import MultiSelectsMenu from "../images/MultiSelectsMenu";
import ConfirmationMessage from "../../app/common/confirmation/ConfirmationMessage";
import { SettingName } from "../../app/models/userSettings";

export default observer(function ImageUploadWidget() {
    //const [files, setFiles] = useState<any>([]);
    const {imageStore, modalStore, userStore} = useStore();
    const {uploading, uploadedImages, uploadImages, dropZoneFiles, resetDropZoneFiles, setDropZoneFile,
        editUploadResult, deleteMultiSelectImageList, resetImageUploads} = imageStore;
        const {getSettings} = userStore;

    const [multiSelectImages, setMultiSelectImages] = useState(new Map<string, ImageData>())
    const [selectedImage, setSelectedImage] = useState<ImageData | null>(null)

    const loadingStyles = {
        border: 'dashed 3px #eee',
        borderColor: '#eee',
        borderRadius: '5px',
        paddingTop: '30px',
        textAlign: 'center' as 'center',
        height: 120,
        width: "100%"
    }

//clean state
    useEffect(() => {
        return () => {
            dropZoneFiles.forEach((file : any) => {
                URL.revokeObjectURL(file.preview)
            });
        }
    }, [dropZoneFiles])

    const renderDroppedImages = () => {
        let rows : ReactElement[] = [];
        if(uploading)
        {
            rows.push(
                <Grid.Column width={10} key={"loadingComponentColumn"}>
                    <LoadingComponent content="uploading" key="loadingComponent" styles={loadingStyles}/>
                </Grid.Column>
            )
            return rows;
        }
        if(dropZoneFiles.length === 0)
            return rows;
        rows.push(
            <Grid.Column width={16} key={"toUploadColumn"}>
                <Header textAlign="center" key={"toUploadHeader"}>Images to upload</Header>
            </Grid.Column>
        );
        for(let i = 0; i < dropZoneFiles.length; i++)
        {
            rows.push(
                <Grid.Column key={i} width={3} style={{maxHeight: '150px'}}>
                    <Image key={i} src={dropZoneFiles[i].preview} alt={"error converting image"} style={{ maxHeight: '100%', width: 'auto' }}/>
                </Grid.Column>
            )
        }
        return rows;
    }

    const cancelDroppedFiles = () => {
        dropZoneFiles.forEach((file : any) => {
            URL.revokeObjectURL(file.preview)
        });
        resetDropZoneFiles();
    }

    const uploadDroppedImages = () => {
        try {
            const blobArray = dropZoneFiles.map((file: any) => new Blob([file], { type: file.type }))
            uploadImages(blobArray)
          } catch (error) {
            console.log(error)
          }
    }

    const onSelectImage = (image: ImageData): void => {
        setSelectedImage(image);
    }

    const onMultiSelectImages = (images: Map<string,ImageData>): void =>
    {
        setMultiSelectImages(images);
    }

    const unSelectImage = (index: ImageData) => {
        setSelectedImage(null);
        onMultiSelectImages(new Map<string, ImageData>().set(index.id, index));
    }

    const onDeleteDetails = (img: ImageData) => {
        editUploadResult(uploadedImages.filter(x => x.id !== img.id));
        if(uploadedImages.length === 0)
        {
            setSelectedImage(null);
        }
    }

    const confirmDeleteSelected = () =>
    {
        deleteMultiSelectImageList(multiSelectImages);
        editUploadResult(uploadedImages.filter(x => !multiSelectImages.has(x.id)));
        setMultiSelectImages(new Map<string, ImageData>());
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

    const onSort = (imgs : ImageData[]) =>
    {
        editUploadResult(imgs);
    }

    const onClear = () =>{
        setMultiSelectImages(new Map<string, ImageData>());
        resetImageUploads();
    }

    return (
        <Container id="image_search_page">
            {(selectedImage && uploadedImages.length > 0) ?
                <ImageDetails images={uploadedImages} clickedImage={selectedImage} exit={unSelectImage} onDelete={onDeleteDetails}/>
            :
                <Fragment>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={3}/>
                            <Grid.Column width={10}>
                                {uploading ? 
                                    (<LoadingComponent content="uploading" key="loadingComponent" styles={loadingStyles}/>)
                                    :
                                    (<ImageDropZone setFiles={setDropZoneFile}/>)
                                }
                            </Grid.Column>
                            <Grid.Column width={3}/>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={3}/>
                            <Grid.Column width={10}>
                                <Button.Group widths={2}>
                                    <Button loading={uploading} disabled={uploading || dropZoneFiles.length === 0} 
                                        positive content="Upload" icon="cloud" 
                                        onClick={() => uploadDroppedImages()}/>
                                    <Button loading={uploading} disabled={uploading || dropZoneFiles.length === 0} 
                                        negative content="Cancel" icon="trash" 
                                        onClick={() => cancelDroppedFiles()}/>
                                </Button.Group>
                            </Grid.Column>
                            <Grid.Column width={3}/>
                        </Grid.Row>
                    </Grid>
                    <Grid>
                        <Grid.Column width={3}/>
                        <Grid.Column width={10}>
                            <Grid>
                                {renderDroppedImages()}
                            </Grid>
                        </Grid.Column>
                        <Grid.Column width={3}/>
                    </Grid>
                        {uploadedImages.length > 0 && 
                            <Grid padded={true}>
                                <Grid.Row>
                                <Grid.Column width={3}  style={{ margin: 0, padding: 0 }}/>
                                <Grid.Column width={3}  style={{ margin: 0, padding: 0 }}>
                                    <Button content="clear uploads" negative onClick={() => {onClear()}}/>
                                </Grid.Column>
                                </Grid.Row>
                                <Grid.Row style={{ margin: 0, padding: 0 }}>
                                    <Grid.Column width={3}  style={{ margin: 0, padding: 0 }}/>
                                    <Grid.Column  width={9} style={{ margin: 0, padding: 0 }}>
                                        <Grid.Row>
                                            <ImageSortBar images={uploadedImages} onSort={onSort}/>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <ImagesGrid images={uploadedImages} multiSelectMode
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
                </Fragment>
            }
        </Container>
    )
})
