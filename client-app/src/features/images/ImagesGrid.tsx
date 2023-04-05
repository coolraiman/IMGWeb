import React, { Component, useState, MouseEvent, useEffect } from 'react'
import { observer } from "mobx-react-lite";
import { ImageData } from '../../app/models/imageData';
import { Button, Container, Grid, Image, Input, Segment} from "semantic-ui-react";
import { useStore } from '../../app/stores/store';
import { Tag } from '../../app/models/tag';

interface Props{
    images: ImageData[];
    onSelect(selected: ImageData) : void;
    onMultiSelect(images: Map<string,ImageData>): void;
    multiSelectMode: boolean;
    detailsMode: boolean;
}

export default observer(function ImagesGrid({images, multiSelectMode, detailsMode, onSelect, onMultiSelect} : Props)
{
    const {imageStore} = useStore();
    const {loading} = imageStore;

    const [lastClickId, setLastClickId] = useState("");
    const [multiSelect, setMultiSelect] = useState(new Map<string, ImageData>())

    const onDoubleClickHandler = (img: ImageData) => {
        //if(!loading)
        //    selectImage(img)
    }

    useEffect(() => {
        resetMultiSelect();
    }, [])

    useEffect(() => {
        onMultiSelect(multiSelect);
    }, [multiSelect])

    const selectManyImage = (e: MouseEvent<HTMLButtonElement>, imgClick: ImageData) => {
        const imgData : ImageData | undefined = images.find(x => x.id === imgClick.id);
        let temp: Map<string, ImageData> = multiSelect;
        let tempLastClickId = lastClickId;
        if(imgData === undefined)
        {
            return;
        }
        if(tempLastClickId === "")
        {
            tempLastClickId = imgClick.id;
        }

        if(e.shiftKey && multiSelectMode)
        {
            let startIndex : number = images.findIndex(x => x.id === imgClick.id);
            let endIndex : number = images.findIndex(x => x.id === tempLastClickId);
            if(startIndex < 0 || endIndex < 0)
            {
                return;
            }
            if(endIndex < startIndex)
            {
                const temp : number = startIndex;
                startIndex = endIndex;
                endIndex = temp;
            }
            for(let i : number = startIndex; i <= endIndex; i++)
            {
                temp.set(images[i].id,images[i]);
            }
        }
        else if(e.ctrlKey && multiSelectMode)
        {
            if(temp.has(imgClick.id))
            {
                temp.delete(imgClick.id);
            }
            else
            {
                temp.set(imgClick.id, imgClick);
            }
        }
        else
        {
            const has : boolean = temp.has(imgClick.id);
            temp = new Map<string,ImageData>();
            if(!has)
            {
                temp = new Map<string,ImageData>().set(imgClick.id,imgClick);
            }
        }
        setLastClickId(imgClick.id);
        setMultiSelect(new Map<string,ImageData>(temp));
    }

    const resetMultiSelect = () => {
        setMultiSelect(new  Map<string, ImageData>());
        setLastClickId("");
    }

    return (

            <Grid celled padded>
                {images.map((img) =>(
                    <Grid.Column key={img.id} width={3} {...multiSelect.has(img.id) && {color:"teal"}}
                        onClick={(e: MouseEvent<HTMLButtonElement>) => selectManyImage(e, img)}>
                        <Button className='transparent_button_layout'>
                            <Image key={img.id} src={img.url} alt={img.filename}
                            onDoubleClick={() => onSelect(img)}
                                />
                        </Button>
                    </Grid.Column>
                ))}
            </Grid>

    )
})
//onDoubleClick={() => onSelect(img, images)}