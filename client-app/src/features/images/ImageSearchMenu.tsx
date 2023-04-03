import React, { Component, useState } from 'react'
import { observer } from "mobx-react-lite";
import { Fragment, useEffect } from "react";
import { Button, Label, List, Search, SearchResult, SearchResultProps, Segment, SemanticWIDTHS } from "semantic-ui-react";
import { Tag } from "../../app/models/tag";
import { useStore } from "../../app/stores/store";
import TagParam from "./TagParam";
import TagSearchBar from './TagSearchBar';


export default observer(function ImageSearchMenu()
{
    const {tagStore, imageStore} = useStore();
    const {searchParams, searchImages, loading} = imageStore;
    const {tags, loadTags} = tagStore;

    useEffect(() => {
        if(tags.length < 1) loadTags();
    }, [tags.length, loadTags])

    return (
        <Segment className="image_search_menu">
            <h4>Search Gallery</h4>
                <Label>Include Tags</Label>
                <br/><br/>
                <TagSearchBar isInclude={true}/>
                <Segment>
                    <List>
                        {searchParams.include.map((tagId) =>(
                            <TagParam key={tagId} tag={tags.find(x => x.id === tagId)!} isInclude={true}/>
                                ))}
                    </List>
                </Segment>
                <hr/>
                <Label>Exclude Tags</Label>
                <br/><br/>
                <TagSearchBar isInclude={false}/>
                <List>
                    {searchParams.exclude.map((tagId) =>(
                        <TagParam tag={tags.find(x => x.id === tagId)!} isInclude={false}/>
                            ))}
                </List>
            <hr/>
            <Button.Group widths={"6"}>
                <Button loading={loading} primary onClick={searchImages}>Search</Button>
                <Button loading={loading} negative onClick={searchImages}>Cancel</Button>
            </Button.Group>
        </Segment>
    )
})