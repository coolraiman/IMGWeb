import { observer } from "mobx-react-lite";
import { Fragment, ReactElement, useState } from "react";
import { Button, Grid, Label, Search, Segment } from "semantic-ui-react";
import LoadingComponent from "../../app/layout/loadingComponent";
import { Tag } from "../../app/models/tag";
import { useStore } from "../../app/stores/store";

interface SearchResult {
    title: string;
    tag: Tag;
}

export default observer(function MultiSelectMenu(){
    const {imageStore, tagStore} = useStore();
    const {multiSelectCombinedTags,multiSelect, loading, addTagToImages, removeTagToImages} = imageStore;
    const {tags} = tagStore;
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);

    const loadingStyles = {
        marginTop: '30px',
        textAlign: 'center' as 'center',
        height: 120,
        width: "100%"
    }

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

    const onClickDelete = (t: Tag) => {
        removeTagToImages(t, Array.from(multiSelect.values()));
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
        <Segment>
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
                </Fragment>
            )}
        </Segment>
    );
})