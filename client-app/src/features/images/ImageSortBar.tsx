import { observer } from "mobx-react-lite";
import React, { Fragment, ReactElement, useState } from "react";
import { Link } from "react-router-dom";
import { Dropdown, Grid, Menu, Tab, Transition } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";



export default observer(function ImageSortBar()
{
    const {imageStore} = useStore();
    const {searchResult, sortAlgo, sortImages} = imageStore;
    const [selected, setSected] = useState(-1);
    const [order, setOrder] = useState(true)

    const onSelect = (index : number, orderIndex: boolean) =>
    {
        setSected(index);
        setOrder(orderIndex);
        sortImages(index, orderIndex);
    }

    const renderBar= () => {
        let sortBar : ReactElement[] = [];
        for(let i = 0; i < sortAlgo.sorts.length; i++)
        {
            sortBar.push(
                <Menu.Item key={i} disabled={searchResult.length <= 0} 
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