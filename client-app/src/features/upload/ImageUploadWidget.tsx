import React, { Fragment, ReactElement, useEffect, useState } from "react";
import { Button, Container, Grid, GridColumn, Header, Image } from "semantic-ui-react";
import ImageDropZone from "./ImageDropZone";
import { useStore } from "../../app/stores/store";
import { observer, useObserver } from "mobx-react-lite";
import LoadingComponent from "../../app/layout/loadingComponent";

export default observer(function ImageUploadWidget() {
    //const [files, setFiles] = useState<any>([]);
    const {imageStore} = useStore();
    const {uploading, uploadedImages, uploadImages, dropZoneFiles, resetDropZoneFiles, setDropZoneFile} = imageStore;

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
                <Grid.Column width={16} key={"loadingComponentColumn"}>
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
                <Grid.Column key={i} width={3}>
                    <Button className='transparent_button_layout'>
                        <Image key={i} src={dropZoneFiles[i].preview} alt={"error converting image"}/>
                    </Button>
                </Grid.Column>
            )
        }
        return rows;
    }

    const renderUploadedImages = () => {
        let rows : ReactElement[] = [];
        if(uploadedImages.length === 0)
            return rows;
        rows.push(
            <Grid.Column width={16} key={"uploadedColumn"}>
                <Header textAlign="center" key={"uploadedHeader"}>Uploaded images</Header>
            </Grid.Column>
        );
        uploadedImages.map((img) => (
            rows.push(
                <Grid.Column key={img.id} width={3}>
                    <Button className='transparent_button_layout'>
                        <Image key={img.id} src={img.url} alt={img.name}/>
                    </Button>
                </Grid.Column>
            )

        ))
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

    return (
        <Container>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={16}>
                        {uploading ? 
                            (<LoadingComponent content="uploading" key="loadingComponent" styles={loadingStyles}/>)
                            :
                            (<ImageDropZone setFiles={setDropZoneFile}/>)
                        }
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Button.Group widths={2}>
                            <Button loading={uploading} disabled={uploading || dropZoneFiles.length === 0} 
                                positive content="Upload" icon="cloud" 
                                onClick={() => uploadDroppedImages()}/>
                            <Button loading={uploading} disabled={uploading || dropZoneFiles.length === 0} 
                                negative content="Cancel" icon="trash" 
                                onClick={() => cancelDroppedFiles()}/>
                        </Button.Group>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <Grid celled>
                {renderDroppedImages()}
                <Grid.Row>
                    <hr/>
                </Grid.Row>
                {renderUploadedImages()}
            </Grid>
        </Container>
    )
})
