import { observer } from "mobx-react-lite";
import { Fragment } from "react";
import { Container, Grid, Segment } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import ImageDetails from "./ImageDetails";
import ImageGrid from "./ImageGrid";
import ImageSearchMenu from "./ImageSearchMenu";
import MultiSelectMenu from "./MultiSelectMenu";

export default observer(function ImageSearchPage()
{
    const {imageStore} = useStore();
    const {selectedImage, multiSelect} = imageStore;
    
    return (
        <Container id="image_search_page">
            {selectedImage ?
            <Fragment>
                <ImageDetails/>
            </Fragment>
            :
            <Grid padded={true}>
                <Grid.Row style={{ margin: 0, padding: 0 }}>
                    <Grid.Column width={3}  style={{ margin: 0, padding: 0 }}>
                        <ImageSearchMenu/>
                    </Grid.Column>
                    <Grid.Column  width={10} style={{ margin: 0, padding: 0 }}>
                        <ImageGrid/>
                    </Grid.Column>
                    <Grid.Column width={3}>
                    {(multiSelect.size > 0) && 
                        <MultiSelectMenu/>
                    }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            }
        </Container>
    )
})