import React, { Component, Fragment, ReactElement, useState } from 'react'
import { observer } from "mobx-react-lite";
import { Button, Container, Grid, Icon, Image, Label, Loader, Search, SearchResult, Segment} from "semantic-ui-react";
import { useStore } from '../../app/stores/store';
import LoadingComponent from '../../app/layout/loadingComponent';
import { Tag } from '../../app/models/tag';
import _ from 'lodash';

interface SearchResult {
    title: string;
    tag: Tag;
}

export default observer(function ImageDetails()
{
    const {imageStore, tagStore} = useStore();
    const {selectedImage, selectedIndex ,updateRatings,updateSelectedImageFavorite, removeSelectedImage,
        nextImage, previousImage, deleteSelectedImage ,loadingSelectedImageInfo,
        addTagToSelectedImage, removeTagToSelectedImage} = imageStore;
    const {tags} = tagStore;
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);

    const handleSearchChange = (event: any, { value }: any) => {
        setSearchTerm(value);
        let matchingResults = tags.filter((option) =>
          option.name.toLowerCase().includes(value.toLowerCase())
        );
        matchingResults = _.differenceWith(matchingResults, selectedImage!.tags, (a,b) => a === b);
        setResults(matchingResults.map(t => {
            return {
                title: t.name,
                tag: t
            }
        }));
      };

      const handleResultSelect = (event: any, { result }: any) =>
    {
        const selectedTag = tags.find((t) => t.id === result.tag.id);

        if(selectedTag !== undefined)
        {
            addTagToSelectedImage(selectedTag);
        }
        setSearchTerm("");
    }

    const onClickRating = (rating : number) => {
        if(rating === selectedImage?.rating)
        {
            rating = 0;
        }
        updateRatings(rating, selectedImage!.id);
    }


    const renderRating = () => {
        let ratings : ReactElement[] = [];
        for(let i = 1; i < 6; i++)
        {
            if(i <= selectedImage!.rating){
                ratings.push(<Button onClick={() =>onClickRating(i)} 
                    className='transparent_button_layout ui mini compact button ratingIcons' icon='ui circle thin green'/>)
            }
            else
            {//<Icon key={i} name='circle thin' onClick={() => onClickRating(i)}/>
                ratings.push(<Button onClick={() =>onClickRating(i)} 
                    className='transparent_button_layout ui mini compact button ratingIcons' icon='ui circle thin'/>)
            }
        }
        return ratings;
    }

    const renderFavorite = () => {
        if(selectedImage?.favorite)
        {
            return <Icon key={0} name='star' color='yellow' onClick={() => updateSelectedImageFavorite()}/>
        }
        else
        {
            return <Icon key={0} name='star' onClick={() => updateSelectedImageFavorite()}/>
        }
    }

    return (
        <div className='image_details_segment'>
            <Grid columns={2} container>
                <Grid.Column width={6}>
                    <Segment className='image_info'>
                        <Fragment>
                        {loadingSelectedImageInfo ?
                            <LoadingComponent/>
                        :
                            <Fragment>
                                <Grid>
                                    <Grid.Row columns={3}>
                                        <Grid.Column>
                                            <Button onClick={() => previousImage()}><Icon name='angle left'/></Button>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Label>{(selectedIndex!+1)}/{imageStore.searchResult.length}</Label>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Button onClick={() => nextImage()}><Icon name='angle right'/></Button>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row columns={3}>
                                        <Grid.Column>
                                            <Button primary onClick={() => removeSelectedImage()}>Return</Button>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Label className='h3'>image info</Label>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Button color="red" onClick={() => deleteSelectedImage()}>Delete</Button>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                                <Label>file name : {selectedImage?.filename}</Label><br/>
                                <Label>name : {selectedImage?.name}</Label><br/>
                                <Label>File type : {selectedImage?.extension}</Label><br/>
                                <Label>File size : {selectedImage?.fileSize}</Label><br/>
                                <Label>Views : {selectedImage?.views}</Label><br/>
                                <Label>Height : {selectedImage?.height}</Label><br/>
                                <Label>Width : {selectedImage?.width}</Label><br/>
                                <Label>Rating : {selectedImage?.rating}</Label>
                                {renderRating()}<br/>
                                <Label>Favorite : </Label>
                                {renderFavorite()}
                            </Fragment>
                            }
                        </Fragment>
                        <hr/>
                        <Search
                            onSearchChange={handleSearchChange}
                            onResultSelect={handleResultSelect}
                            value={searchTerm}
                            results={results}
                        />
                        {selectedImage!.tags.map((tag) => (
                            <Fragment key={tag.id}>
                                <Button key={tag.id} onClick={() => removeTagToSelectedImage(tag)}>
                                    {tag.name} <Icon name='close'
                                    />
                                </Button>
                                <br/>
                            </Fragment>
                        ))}
                    </Segment>
                </Grid.Column>
                <Grid.Column width={10}>
                    <Grid.Row centered>
                        <Image src={selectedImage?.url} alt={selectedImage?.filename}/>
                    </Grid.Row>
                </Grid.Column>
            </Grid>
        </div>
    );
})