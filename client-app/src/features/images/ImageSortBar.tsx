import { observer } from "mobx-react-lite";
import { ReactElement, useState } from "react";
import { Dropdown, Menu } from "semantic-ui-react";
import { ImageData } from "../../app/models/imageData";
import { useStore } from "../../app/stores/store";

interface Props{
    images: ImageData[];
    onSort: (sortedImages: ImageData[]) => void;
}

export default observer(function ImageSortBar({images, onSort} : Props)
{
    const {imageStore} = useStore();
    const {sortAlgo, sortImages} = imageStore;
    const [selected, setSelected] = useState(-1);
    const [order, setOrder] = useState(true)

    const onSelect = (index : number, orderIndex: boolean) =>
    {
        setSelected(index);
        setOrder(orderIndex);
        onSort(sortImages(index, orderIndex, images));
    }

    const renderBar= () => {
        let sortBar : ReactElement[] = [];
        for(let i = 0; i < sortAlgo.sorts.length; i++)
        {
            sortBar.push(
                <Menu.Item key={i} disabled={images.length <= 0}
                    style={i === selected ? {backgroundColor: "#0ea5e9", border: "black"} : {}}>
                    <Dropdown key={i} pointing='top left'
                        text={i === selected ? sortAlgo.sorts[i].name + " " + sortAlgo.sorts[i].detailedName[order ? 0 : 1] : sortAlgo.sorts[i].name}>
                        <Dropdown.Menu key={i}>
                            <Dropdown.Item key={sortAlgo.sorts[i].name + "_ascending"} text={sortAlgo.sorts[i].detailedName[0]} onClick={() => onSelect(i,true)}/>
                            <Dropdown.Item key={sortAlgo.sorts[i].name + "_descending"} text={sortAlgo.sorts[i].detailedName[1]} onClick={() => onSelect(i,false)}/>
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Item>);
        }
        return sortBar;
    }

    return (
        <Menu>
            {renderBar()}
        </Menu>
    )
})