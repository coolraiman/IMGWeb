import { observer } from "mobx-react-lite";
import { Fragment } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button, Container, Menu, Dropdown, Icon } from "semantic-ui-react";
import LoginForm from "../../features/users/LoginForm";
import RegisterForm from "../../features/users/RegisterForm";
import { useStore } from "../stores/store";

//<i class="cloud upload icon"></i>
export default observer(function NavBar()
{
    const {userStore: {user, logout, isLoggedIn}, modalStore} = useStore();
    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item as={NavLink} to='/' header>
                    <Icon name="image outline" size="large"/>
                    IMGWeb
                </Menu.Item>
                {isLoggedIn ? (
                    <Fragment>
                        <Menu.Item >
                            <Button as={Link} to="/tags" size='huge' inverted>Tags</Button>
                        </Menu.Item>
                        <Menu.Item>
                            <Button as={Link} to="/images" size='huge' inverted>Search</Button>
                        </Menu.Item>
                        <Menu.Item>
                            <Button as={Link} to="/upload" size='huge' inverted>Upload &nbsp;<Icon name="cloud upload"/></Button>
                        </Menu.Item>
                        <Menu.Item position='right'>
                            <Dropdown pointing='top left' text={user?.displayName}>
                                <Dropdown.Menu>
                                    <Dropdown.Item as={Link} to="/profile" text='My Profile' icon='user' />
                                    <Dropdown.Item onClick={logout} text='Logout' icon='power'/>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Menu.Item>
                    </Fragment>
                ) : (
                    <Menu.Item>
                        <Button onClick={() => modalStore.openModal(<LoginForm />)} size='huge' inverted>
                            Login!
                        </Button>
                        <Button onClick={() => modalStore.openModal(<RegisterForm/>)} size='huge' inverted>
                            Register
                        </Button>
                    </Menu.Item>
                )}
            </Container>
        </Menu>
    )
})