import React, { useState } from 'react';
import { useForm, Controller, set } from 'react-hook-form';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import APIRequests from '@/api';
import Friends from './friends';
import Requests from './requests';
import Sent from './sent';
import "./friends.css"

import { useSelector, useDispatch } from 'react-redux';
import { toggleChat, addStatus, setUser } from "@/redux/reducers/chatReducer";

const FriendModal = ({ modal, setModal }) => {

    const users = useSelector(state => state.chat.users);

    const friends = users.filter(user => user.status === "ACCEPTED");

    const requests = users.filter(user => user.status === "PENDING");

    const sent = users.filter(user => user.status === "SENT");

    const toggle = () => setModal(!modal);

    return (
        <Modal isOpen={modal} toggle={toggle} centered className="friend-modal">
            <ModalHeader toggle={toggle} centered style={{
                textAlign: "center",
                width: "100%",
            }}>Friends</ModalHeader>
            <ModalBody>
                <div>
                    <Tabs isFitted variant='soft-rounded' colorScheme='blue'>
                        <TabList>
                            <Tab>Friend Requests</Tab>
                            <Tab>Friend List</Tab>
                            <Tab>Follow Requests Sent</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <Requests requests={requests} />
                            </TabPanel>
                            <TabPanel>
                                <Friends friends={friends} />
                            </TabPanel>
                            <TabPanel>
                                <Sent sent={sent} />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default FriendModal; 