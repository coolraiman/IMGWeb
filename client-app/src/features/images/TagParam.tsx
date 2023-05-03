import { Button, Grid, Icon, Label, List } from "semantic-ui-react";
import { Tag } from "../../app/models/tag";
import { useStore } from "../../app/stores/store";

interface Props {
    tag: Tag;
    isInclude : boolean
}
export default function TagParam({tag, isInclude} : Props) 
{
    const {imageStore} = useStore();
    const {removeIncludeParam, removeExcludeParam} = imageStore;

    const handleIconClick = () => {
        console.log("remove")
        if(isInclude)
        {
            removeIncludeParam(tag.id);
        }
        else
        {
            removeExcludeParam(tag.id);
        }
      };

    return (
        <Grid.Row key={tag.id + "mainRow"} title={tag.description}>
            <Grid key={tag.id + "grid"} style={{padding:"0px", margin:"-20px"}}>
                <Grid.Column key={tag.id + "col1"} width={12} floated='left'>
                    <Label key={tag.id + "label"} style={{width:"100%"}} className="transparent_button_layout">{tag.name}</Label>
                </Grid.Column>
                <Grid.Column key={tag.id + "col2"} width={4} floated='right'>
                    <Button key={tag.id + "delete"} inverted color="red" icon="close" onClick={() => handleIconClick()}/>
                </Grid.Column>
            </Grid>
        </Grid.Row>
    );
}