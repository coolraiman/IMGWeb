import { observer } from "mobx-react-lite";
import { Fragment, ReactElement, useEffect, useState } from "react";
import { Button, Grid, Label, Search, Segment } from "semantic-ui-react";
import ConfirmationMessage from "../../app/common/confirmation/ConfirmationMessage";
import LoadingComponent from "../../app/layout/loadingComponent";
import { Tag } from "../../app/models/tag";
import { useStore } from "../../app/stores/store"
import { ImageData } from "../../app/models/imageData";
import { SettingName } from "../../app/models/userSettings";

interface SearchResult {
    title: string;
    tag: Tag;
}

interface Props {
    multiSelect : Map<string, ImageData>;
    onDeleteSelection(): void;
}

export default observer(function MultiSelectsMenu({multiSelect, onDeleteSelection} : Props){
    const {imageStore, tagStore, modalStore, userStore} = useStore();
    const {loading, addTagToImages, removeTagToImages} = imageStore;
    const {tags} = tagStore;
    const {getSettings} = userStore;

    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [multiSelectCombinedTags, setMultiSelectCombinedTags] = useState<Map<number, Tag>>(new Map<number, Tag>());

    const loadingStyles = {
        marginTop: '30px',
        textAlign: 'center' as 'center',
        height: 120,
        width: "100%"
    }

    useEffect(() => {
        const temp : Map<number, Tag> = new Map<number, Tag>();
        multiSelect.forEach((img) => {
            img.tags.forEach((tag) => {
                temp.set(tag.id, tag)
            })
        })
        setMultiSelectCombinedTags(temp);
    }, [multiSelect])

    useEffect(() => {
        if(!loading)
        {
            const temp : Map<number, Tag> = new Map<number, Tag>();
            multiSelect.forEach((img) => {
                img.tags.forEach((tag) => {
                    temp.set(tag.id, tag)
                })
            })
            setMultiSelectCombinedTags(temp);
        }
    }, [loading])

    const handleSearchChange = (event: any, { value }: any) => {
        setSearchTerm(value);
        let matchingResults = tags.filter((option) =>
          option.name.toLowerCase().includes(value.toLowerCase())
        );
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
        if(selectedTag)
        {
            addTagToImages(selectedTag, Array.from(multiSelect.values()));
        }
        setSearchTerm("");
    }

    type DeleteParams = [Tag, ImageData[]];
    const onClickDelete = (t: Tag) => {
        if((multiSelect.size === 1 && !getSettings().deleteTag) || !getSettings().deleteMultiTags)
        {
            removeTagToImages(t, Array.from(multiSelect.values()))
        }
        else
        {
            const args: DeleteParams  = [t, Array.from(multiSelect.values())];
            modalStore.openModal(
                <ConfirmationMessage
                    message={`Do you want to remove the tag (${t.name}) from the selection?`}
                    positiveButton="Remove" negativeButton="Cancel" rememberBox 
                    settingName={(multiSelect.size === 1) ? SettingName.DeleteTag : SettingName.DeleteMultiTag}
                    func={removeTagToImages} args={args}
                />
            )
        }
    }

    const onClickDeleteSelected = () =>
    {
        onDeleteSelection();
    }

    const renderTags = () => {
        let tags : ReactElement[] = [];
        multiSelectCombinedTags.forEach((t) => {
            tags.push(
                <Grid.Row key={t.id + "row"} >
                    <Grid key={t.id + "grid"} style={{padding:"0px", margin:"-20px"}}>
                        <Grid.Column key={t.id + "col1"} width={13} floated='left'>
                            <Label key={t.id + "label"} style={{width:"100%"}} className="transparent_button_layout">{t.name}</Label>
                        </Grid.Column>
                        <Grid.Column key={t.id + "col2"} width={3} floated='right'>
                            <Button key={t.id + "delete"} inverted color="red" icon="trash" style={{width:"100%"}} onClick={() => onClickDelete(t)}/>
                        </Grid.Column>
                    </Grid>
                    <hr key={t.id + "hr"}/>
                </Grid.Row>
            );
        })
        return tags;
    }

    return (
        <Fragment>
            {loading ? (
                <LoadingComponent styles={loadingStyles}/>
            ):
            (
                <Fragment>
                    <Grid.Row textAlign="center">
                        <h3>Selection manager</h3>
                    </Grid.Row>
                    <Grid.Row>
                    <Search
                        onSearchChange={handleSearchChange}
                        onResultSelect={handleResultSelect}
                        value={searchTerm}
                        results={results}
                    />
                    </Grid.Row>
                    <hr/>
                    {renderTags()}
                    <Button color='red' onClick={() => onClickDeleteSelected()}>Delete Selected</Button>
                </Fragment>
            )}
        </Fragment>
    );
})