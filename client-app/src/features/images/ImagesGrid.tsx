import { useState, MouseEvent, useEffect } from 'react'
import { observer } from "mobx-react-lite";
import { ImageData } from '../../app/models/imageData';
import { Grid, Image} from "semantic-ui-react";
import { useStore } from '../../app/stores/store';

interface Props{
    images: ImageData[];
    onSelect(selected: ImageData) : void;
    onMultiSelect(images: Map<string,ImageData>): void;
    multiSelectMode: boolean;
}

export default observer(function ImagesGrid({images, multiSelectMode, onSelect, onMultiSelect} : Props)
{
    const {imageStore} = useStore();
    const {loading} = imageStore;

    const [lastClickId, setLastClickId] = useState("");
    const [multiSelect, setMultiSelect] = useState(new Map<string, ImageData>())

    useEffect(() => {
        //resetMultiSelect();
    }, [])

    useEffect(() => {
        onMultiSelect(multiSelect);
    }, [multiSelect])

    const selectManyImage = (e: MouseEvent<HTMLButtonElement>, imgClick: ImageData) => {
        if(loading)
            return;
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

    return (

            <Grid celled padded>
                {images.map((img) =>(
                    <Grid.Column key={img.id} width={3} {...multiSelect.has(img.id) && {color:"teal"}} style={{height: '150px', padding: '4px'}}
                        onClick={(e: MouseEvent<HTMLButtonElement>) => selectManyImage(e, img)}>
                            <Image key={img.id} src={img.url} alt={img.filename} style={{ height: '100%', width: 'auto' }} centered
                                onDoubleClick={() => onSelect(img)}
                            />
                    </Grid.Column>
                ))}
            </Grid>

    )
})