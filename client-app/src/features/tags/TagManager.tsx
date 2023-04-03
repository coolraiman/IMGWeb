import { observer } from "mobx-react-lite"
import { Fragment, useEffect } from "react"
import { Container, Icon, Search, Segment, Table } from "semantic-ui-react";
import LoadingComponent from "../../app/layout/loadingComponent";
import { useStore } from "../../app/stores/store"
import CreateTag from "./CreateTag";
import EditTag from "./EditTag";
import TagDetails from "./TagDetails";

export default observer(function TagManager()
{
    const {tagStore} = useStore();
    const {tags, searchResult, tagsLoaded, selectedTag, loadTags, setSearchParam} = tagStore;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchParam(event.target.value);
      };

    useEffect(() => {
        setSearchParam("");
        if(tags.length < 1) loadTags();
    }, [tags.length, loadTags, setSearchParam])

    if(!tagsLoaded) return <LoadingComponent content='Loading tags...'/>
    return (
        <Fragment>
            <h3>nombre de tags : {tags.length}</h3>
                <Fragment>
                    {(selectedTag) ? (
                        <EditTag/>
                    ) : (
                        <CreateTag/>
                    )}
                    <Segment className="searchInputContainer">
                        <input type="text" onChange={handleChange} placeholder="search"/>
                        <Icon name='search' color='blue'/>
                    </Segment>
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Name</Table.HeaderCell>
                                <Table.HeaderCell>Description</Table.HeaderCell>
                                <Table.HeaderCell>References</Table.HeaderCell>
                                <Table.HeaderCell>Action</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {searchResult.map((tag) =>(
                                <TagDetails key={tag.id} tag={tag}/>
                            ))}
                        </Table.Body>
                    </Table>
                </Fragment>
        </Fragment>
    )
})

