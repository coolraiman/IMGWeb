import React, { Component, useState, MouseEvent, useEffect } from 'react'
import { observer } from "mobx-react-lite";
import { ImageData } from '../../app/models/imageData';
import { Button, Container, Grid, Image, Input, Segment} from "semantic-ui-react";
import { useStore } from '../../app/stores/store';


export default observer(function ImageGrid()
{
    const {imageStore} = useStore();
    const {searchResult,selectImage, multiSelect, selectManyImage, resetMultiSelect, loading} = imageStore;

    const onClickHandler = (e: MouseEvent<HTMLButtonElement>, imgClick: ImageData) => {
        if(!loading)
            selectManyImage(e, imgClick);
    }

    const onDoubleClickHandler = (img: ImageData) => {
        if(!loading)
            selectImage(img)
    }

    useEffect(() => {
        resetMultiSelect();
    }, [])

    return (
        <Container >
            <Grid celled padded>
                {searchResult.map((img) =>(
                    <Grid.Column key={img.id} width={3} {...multiSelect.has(img.id) && {color:"teal"}}
                        onClick={(e: MouseEvent<HTMLButtonElement>) => onClickHandler(e, img)}>
                        <Button className='transparent_button_layout'>
                            <Image key={img.id} src={img.url} alt={img.filename}
                                onDoubleClick={() => selectImage(img)}
                                />
                        </Button>
                    </Grid.Column>
                ))}
            </Grid>
        </Container>
    )
})