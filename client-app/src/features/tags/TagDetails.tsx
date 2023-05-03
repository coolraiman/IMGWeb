import { Fragment } from "react";
import { Button, Icon, Table } from "semantic-ui-react";
import { Tag } from "../../app/models/tag";
import { useStore } from "../../app/stores/store";

interface Props {
    tag: Tag;
}

export default function TagDetails({tag} : Props)
{
    const {tagStore} = useStore();
    const {setSelectedTag, deleteTag} = tagStore;

    return(
        <Table.Row>
            <Fragment>
                <Table.Cell>{tag.name}</Table.Cell>
                <Table.Cell>{tag.description}</Table.Cell>
                <Table.Cell>{tag.references}</Table.Cell>
                <Table.Cell>
                    <Button onClick={() => (deleteTag(tag.id))}><Icon name='trash' color='red'/></Button>
                    <Button onClick={() => (setSelectedTag(tag))}><Icon name='edit' color='blue'/></Button>
                </Table.Cell>
            </Fragment>
        </Table.Row>
    )
}