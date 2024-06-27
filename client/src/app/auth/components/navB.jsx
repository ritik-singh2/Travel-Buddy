"use client"

import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import Logo from '../assets/TB-logo.png'
import Image from 'next/image'
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useRouter, usePathname } from 'next/navigation';
import FriendModal from '@/components/friendModal';
import { Provider } from 'react-redux';
import store from '@/redux/store';

const NavB = () => {
    const [name, setName] = useState(null);
    const [modal, setModal] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setName(localStorage.getItem('profile') ? JSON.parse(localStorage.getItem('profile')).name : -1);
    }, [pathname, name]);

    const router = useRouter();

    const blacklistedRoutes = ['/auth'];

    const handleFriends = () => {
        setModal(!modal);
    }
    const handleLogout = () => {
        localStorage.clear();
        setName(null);
        window.location.reload();
    }
    const handleLogin = () => {
        router.push('/auth');
    }
    if (blacklistedRoutes.includes(pathname)) return null;
    return (
        <Navbar collapseOnSelect expand="lg" bg='dark' variant='dark'>
            <Container>
                <Navbar.Brand href="/">
                    <Image src={Logo} width="50"
                        height="50" className="d-inline-block align-top"
                    />
                    Travel Buddy
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="ms-auto">
                        {name && name != -1 ? (
                            <>
                                <Nav.Link href="/">Home</Nav.Link>
                                <Nav.Link onClick={handleFriends}>Friends</Nav.Link>
                                <Dropdown>  
                                    <Dropdown.Toggle variant="dark" id="dropdown-basic">
                                        {name}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu style={{ width: 'auto' }} variant="dark">
                                        <Dropdown.Item >
                                            <div className="d-flex align-items-center">
                                                <FaUserCircle className="me-2" />
                                                Profile
                                            </div>
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={handleLogout}>
                                            <div className="d-flex align-items-center">
                                                <FaSignOutAlt className="me-2" />
                                                Logout
                                            </div>
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </>
                        ) : name == -1 && (<Button variant="outline-light" onClick={handleLogin}>
                            Sign In / Sign Up
                        </Button>)

                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
            <Provider store={store}>
            <FriendModal modal={modal} setModal={setModal} />
            </Provider>
        </Navbar>
    );
};

export default NavB;
