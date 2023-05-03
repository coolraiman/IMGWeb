import { Container, Grid, Header, Image } from "semantic-ui-react";

export default function HomePage() {
    return (
        <Container style={{marginTop: '3em'}} id="image_search_page">
            <Grid style={{marginTop: '100px'}}>
                <Grid.Row>
                    <Grid.Column width={3}/>
                    <Grid.Column width={3}>
                        <Header as='h2'> the ultimate web app to manage your images</Header>
                        <Header as='h1'>The power of the cloud in your hands</Header>
                        <Header as='h3'>Upload your images to the cloud and access them from anywhere</Header>
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <Image src='/assets/presentation/upload.png' alt='upload' />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={3}/>
                    <Grid.Column width={5}>
                        <Image src='/assets/presentation/details.png' alt='upload' />
                    </Grid.Column>
                    <Grid.Column width={3}>
                        <Header as='h1'>Browse your images</Header>
                        <Header as='h2'>Add or remove tags from your images, rate them, set them as favorite and more</Header>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={3}/>
                    <Grid.Column width={3}>
                        <Header as='h2'>Search your images by including and excluding tags</Header>
                        <Header as='h1'>Sort your images</Header>
                        <Header as='h3'>Select them and manage multiple images at once!</Header>
                    </Grid.Column>
                    <Grid.Column width={9}>
                        <Image src='/assets/presentation/grid.png' alt='upload' />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    )
}