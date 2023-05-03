import React, { Component, useState } from 'react'
import { observer } from "mobx-react-lite";
import { Fragment, useEffect } from "react";
import { Button, Grid, Header, Label, Segment } from "semantic-ui-react";
import { Tag } from "../../app/models/tag";
import { useStore } from "../../app/stores/store";
import TagParam from "./TagParam";
import TagSearchBar from './TagSearchBar';
import { runInAction } from 'mobx';

interface Props {
    onSearch() : void;
}

export default observer(function ImageSearchMenu({onSearch} : Props)
{
    const {tagStore, imageStore} = useStore();
    const {searchParams, searchImages, loading} = imageStore;
    const {tags, loadTags} = tagStore;

    useEffect(() => {
        if(tags.length < 1) loadTags();
    }, [tags.length, loadTags])

    const cancelSearch = () => {
        runInAction(() => {
            searchParams.include = [];
            searchParams.exclude = [];
        })
    }

    const searchClick = () => {
        searchImages();
        onSearch();
    }

    return (
        <Segment className="image_search_menu">
            <Header>Search Images</Header>
            <hr/>
            <Header>Include Tags</Header>
            <TagSearchBar isInclude={true}/>
            <Segment>
                <Grid>
                    {searchParams.include.map((tagId) =>(
                        <Grid.Column key={tagId} width={16}>
                            <TagParam key={tagId} tag={tags.find(x => x.id === tagId)!} isInclude={true}/>
                        </Grid.Column>
                            ))}
                </Grid>
            </Segment>
            <hr/>
            <Header>Exclude Tags</Header>
            <TagSearchBar isInclude={false}/>
            <Segment>
                <Grid>
                    {searchParams.exclude.map((tagId) =>(
                        <Grid.Column key={tagId} width={16}>
                            <TagParam key={tagId} tag={tags.find(x => x.id === tagId)!} isInclude={false}/>
                        </Grid.Column>
                            ))}
                </Grid>
            </Segment>
        <Button.Group widths={"6"}>
            <Button loading={loading} primary onClick={searchClick}>Search</Button>
            <Button loading={loading} negative onClick={cancelSearch}>Cancel</Button>
        </Button.Group>
    </Segment>
    )
})