import { Button, Icon, List } from "semantic-ui-react";
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
        <List.Item key={tag.id} title={tag.description}>
            <Button className="icon_button" onClick={handleIconClick}>
                {tag.name}
                </Button>
            </List.Item>
    );
}