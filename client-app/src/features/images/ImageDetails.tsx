import React, { Fragment, ReactElement, useEffect, useState, KeyboardEvent, useRef  } from 'react'
import { observer } from "mobx-react-lite";
import { Button,  Grid, Header, Icon, Image, Label,  List,  Search, Segment} from "semantic-ui-react";
import { useStore } from '../../app/stores/store';
import LoadingComponent from '../../app/layout/loadingComponent';
import { Tag } from '../../app/models/tag';
import _ from 'lodash';
import ConfirmationMessage from '../../app/common/confirmation/ConfirmationMessage';
import fileSize from 'file-size';
import { SettingName } from '../../app/models/userSettings';
import { ImageData } from '../../app/models/imageData';
import { runInAction } from 'mobx';

interface SearchResult {
    title: string;
    tag: Tag;
}

interface Props {
    images: ImageData[];
    clickedImage: ImageData;
    exit(img:ImageData):void;
    onDelete(img:ImageData):void;
}

export default observer(function ImageDetails({images, clickedImage, exit, onDelete} : Props)
{
    const {imageStore, tagStore, modalStore, userStore} = useStore();
    const {getSettings} = userStore;
    const {updateRatings,updateImageFavorite,
        deleteImage ,loadingSelectedImageInfo,
        addTagToImage, removeTagFromImage, addViewToImage} = imageStore;
    const {tags} = tagStore;
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState<ImageData>(clickedImage);
    const [mounted, setMounted] = useState(false); // add a flag for component mounting

    useEffect(() => {
        if(mounted)
            refreshSelected();
    }, [images.length])
    //called only once when component is
    useEffect(() => {
        setMounted(true);
        selectImage(clickedImage);
    }, [])

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

    const refreshSelected = () => {
        const index = selectedIndex >= images.length ?  0 : selectedIndex;
        if(index !== -1)
        {
            setSelectedImage(images[index]);
            setSelectedIndex(index);
            addViewToImage(images[index]);
        }
    }

    const selectImage = (img : ImageData) => {
        const index = images.findIndex(x => x.id === img.id);
        if(index !== -1)
        {
            setSelectedImage(img);
            setSelectedIndex(index);
            addViewToImage(img);
        }
    }

    
    const nextImage  = () => {
        let tempSelectedIndex = selectedIndex + 1;
        if(tempSelectedIndex >= images.length)
        {
            tempSelectedIndex = 0;
        }
        selectImage(images[tempSelectedIndex]);
    }

    const previousImage = () => {

        let tempSelectedIndex = selectedIndex - 1;
        if(tempSelectedIndex < 0)
        {
            tempSelectedIndex = images.length - 1;
        }

        selectImage(images[tempSelectedIndex]);
    }

    const handleResultSelect = (event: any, { result }: any) =>
    {
        const selectedTag = tags.find((t) => t.id === result.tag.id);

        if(selectedTag !== undefined)
        {
            addTagToImage(selectedImage, selectedTag);
        }
        setSearchTerm("");
    }

    const onClickRating = (rating : number) => {
        if(rating === selectedImage?.rating)
        {
            rating = 0;
        }
        updateRatings(rating, selectedImage.id);
        runInAction(() => {
            selectedImage.rating = rating
            setSelectedImage(selectedImage);
        })
    }

    const onClickDelete = () => {
        if(!getSettings().deleteImage)
        {
            handleDelete(selectedImage);
        }
        else
        {
            modalStore.openModal(
                <ConfirmationMessage
                    message={`Do you want to delete this image?`}
                    positiveButton="Delete" negativeButton="Cancel" rememberBox
                    settingName={SettingName.DeleteImage}
                    func={handleDelete} args={[selectedImage]}
                />
            )
        }
    }

    const handleDelete = (img : ImageData) => {
        deleteImage(selectedImage);
        onDelete(img);
    }

    const onClickTagDelete = (tag:Tag) => {
        if(!getSettings().deleteTag)
        {
            removeTagFromImage(selectedImage, tag)
        }
        else
        {
            modalStore.openModal(
                <ConfirmationMessage
                    message={`Do you want to delete the tag?`}
                    positiveButton="Delete" negativeButton="Cancel" rememberBox
                    settingName={SettingName.DeleteTag}
                    func={removeTagFromImage} args={[selectedImage, tag]}
                />
            )
        }
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        console.log("key event")
        switch (event.key) {
          case 'ArrowLeft':
            previousImage();
            break;
          case 'ArrowRight':
            nextImage();
            break;
          case 'Escape':
            exit(selectedImage);
            break;
          default:
            // do nothing
            break;
        }
      };


    const renderRating = () => {
        let ratings : ReactElement[] = [];
        for(let i = 1; i < 6; i++)
        {
            if(i <= selectedImage!.rating){
                ratings.push(<Button key={i} onClick={() =>onClickRating(i)} 
                    className='ui mini compact button ratingIcons' icon='circle' style={{color:'green'}}/>)
            }
            else
            {
                ratings.push(<Button key={i} onClick={() =>onClickRating(i)} 
                    className='transparent_button_layout ui mini compact button ratingIcons' icon='circle'/>)
            }
        }
        return ratings;
    }

    const renderFavorite = () => {
        if(selectedImage.favorite)
        {
            return <Icon key={0} name='star' color='yellow' onClick={() => updateImageFavorite(selectedImage)}/>
        }
        else
        {
            return <Icon key={0} name='star' onClick={() => updateImageFavorite(selectedImage)}/>
        }
    }

    return (
            <Grid key={selectedImage.id} columns={2} style={{margin:0}} onKeyDown={handleKeyDown} tabIndex={0} >
                <Grid.Column width={3}>
                    <Segment className='image_info'>
                        <Fragment>
                        {loadingSelectedImageInfo ?
                            <LoadingComponent/>
                        :
                            <Fragment key={"frag" + selectedImage.id}>
                                <Grid>
                                    <Grid.Row columns={3}>
                                        <Grid.Column>
                                            <Button floated='left' onClick={() => previousImage()} color='green' disabled={images.length === 1}>
                                                <Icon name='angle left'/>
                                                </Button>
                                        </Grid.Column>
                                        <Grid.Column verticalAlign='middle'>
                                            <Header textAlign='center'>{(selectedIndex+1)}/{images.length}</Header>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Button floated='right' onClick={() => nextImage()} color='green' disabled={images.length === 1}>
                                                <Icon name='angle right'/>
                                                </Button>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row columns={3}>
                                        <Grid.Column>
                                            <Button floated='left' primary onClick={() => exit(selectedImage)}>Return</Button>
                                        </Grid.Column>
                                        <Grid.Column/>
                                        <Grid.Column>
                                            <Button floated='right' color="red" onClick={() => onClickDelete()}>Delete</Button>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                                <List celled>
                                    <List.Item>File type : {selectedImage?.extension}</List.Item>
                                    <List.Item>File size : {fileSize(selectedImage!.fileSize).human()}</List.Item>
                                    <List.Item>Views : {selectedImage?.views}</List.Item>
                                    <List.Item>Height : {selectedImage?.height}</List.Item>
                                    <List.Item>Width : {selectedImage?.width}</List.Item>
                                    <List.Item>Rating : {selectedImage?.rating} | {renderRating()}</List.Item>
                                    <List.Item>Favorite : {renderFavorite()}</List.Item>
                                    <List.Item>Date added : {new Date(selectedImage!.dateAdded).toLocaleDateString()}</List.Item>
                                </List>
                            </Fragment>
                            }
                        </Fragment>
                        <hr/>
                        <Header textAlign='center'>Add Tags</Header>
                        <Search
                            onSearchChange={handleSearchChange}
                            onResultSelect={handleResultSelect}
                            value={searchTerm}
                            results={results}
                            style={{width:"100%"}}
                        />
                        <Header as='h4' textAlign='center'>Tags</Header>
                        <Grid celled='internally' style={{padding:"0px", margin:"-20px"}}>
                            {selectedImage.tags.map((tag) => (
                                <Grid.Row key={tag.id} style={{padding:"0px", margin:"0px"}}>
                                    <Grid.Column key={tag.id + "col1"} width={12} floated='left'>
                                        <Label key={tag.id + "label"} style={{width:"100%"}} className="transparent_button_layout">{tag.name}</Label>
                                    </Grid.Column>
                                    <Grid.Column key={tag.id + "col2"} width={4} floated='right'>
                                        <Button key={tag.id + "delete"} inverted color="red" icon="close" onClick={() => onClickTagDelete(tag)}/>
                                    </Grid.Column>
                                </Grid.Row>
                            ))}
                        </Grid>
                        {(selectedImage.tags.length === 0) && (
                            <Header>No tags</Header>
                        )}
                        <br/>
                    </Segment>
                </Grid.Column>
                <Grid.Column width={13}>
                    <Image key={selectedImage.id} src={selectedImage.url} alt={selectedImage.filename} centered/>
                </Grid.Column>
            </Grid>
    );
})

