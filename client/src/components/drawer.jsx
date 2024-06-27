"use client"

import React, { useState, useEffect } from "react";
import { Button, useDisclosure } from "@chakra-ui/react";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'

import { useSelector, useDispatch } from 'react-redux';
import { toggleChat, addStatus } from "@/redux/reducers/chatReducer";

import { AiOutlineUserAdd } from "react-icons/ai";
import { FiUserCheck } from "react-icons/fi";
import APIRequests from "@/api";
import { toast } from "react-toastify";
import { LiaHourglassEndSolid, LiaTimesSolid, LiaBanSolid } from "react-icons/lia";
import io from 'socket.io-client';
import Chat from "./Chat";

// const socket = io.connect("http://localhost:5001")
const socket = io.connect(process.env.NEXT_PUBLIC_API ?? "http://localhost:5000")

export default function ChatDrawer() {
  const [myInfo, setMyInfo] = useState();
  const selectedUser = useSelector(state => state.chat.selectedUser);

  const user = useSelector(state => state.chat.users[selectedUser]);

  const dispatch = useDispatch();
  const { onOpen, onClose } = useDisclosure()

  const isOpen = useSelector(state => state.chat.isOpen);

  useEffect(() => {
    setMyInfo(JSON.parse(localStorage.getItem("profile")));
  }, []);

  useEffect(() => {
    if (isOpen) {
      onOpen();
    }
    if (user && user.status == "ACCEPTED") {
      socket.emit("join_room", (user.location.latitude + myInfo.location.latitude))
    }
  }, [isOpen]);


  return (
    <>
      <Drawer onClose={() => {
        dispatch(toggleChat(false));
        onClose();
      }} isOpen={isOpen} size="md" height="100vh">
        <DrawerOverlay />
        <DrawerContent sx={
          {
            backdropFilter: "blur(3px)",
            backgroundColor: "rgba(173, 234, 234, 0.3)",
            borderRadius: "20px 0 0 20px",
          }
        }>
          <DrawerCloseButton color={"white"} />
          {user && user.name && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <DrawerHeader style={{ marginRight: '5px' }}>{user.name}</DrawerHeader>
              {/* {() => StatusIcon(user.status, user._id, selectedUser)} */}
              <StatusIcon status={user.status} id={user._id} selectedUser={selectedUser} />
            </div>
          )}

          <DrawerBody>
            {user && user.status == "ACCEPTED" ? (
                <Chat socket={socket} receiver={user} sender={myInfo} room={user.location.latitude + myInfo.location.latitude}/>
            ) : user && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                // height: '100%',
                border: '1px solid white',
                borderRadius: '10px',
                padding: '10px',
                color: 'white',
                backgroundColor: 'rgba(0,0,0,0.5)',
                blur: '10px'
              }}>
                To chat with {user.name}, send a friend request.
              </div>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>

  )
}

const StatusIcon = ({status, id, selectedUser}) => {

  const dispatch = useDispatch();
  const toastConfig = {
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  if (status == "ACCEPTED") {
    return <FiUserCheck color="white" size={"25px"} />
  }
  else if (status == "SENT") {
    return <LiaHourglassEndSolid color="white" size={"25px"}
      onClick={() => {
        toast.info("Friend request already sent", toastConfig);
      }}
    />
  }
  else if (status == "REJECTED") {
    return <LiaTimesSolid color="white" size={"25px"} />
  }
  else if (status == "BLOCKED") {
    return <LiaBanSolid color="white" size={"25px"}
      onClick={() => {
        toast.error("You have been blocked by this user", toastConfig);
      }}
    />
  }
  else if (status == "PENDING") {
    return (
      <div style={{
        display: 'flex',
        // justifyContent: 'space-evenly',
        alignItems: 'center',
        // width: '100%'
      }}>
        <Button variant="outline" colorScheme="green" size="sm" marginRight="5px" onClick={() => {
          APIRequests.acceptFriendRequest(id).then((res) => {
            if (res.status == 200) {
              toast.success("Friend request accepted!", toastConfig);
              dispatch(addStatus({
                i: selectedUser,
                status: "ACCEPTED"
              }));
            }
          }).catch((err) => {
            console.log("Error accepting friend request", err);
            toast.error("Error accepting friend request", toastConfig);
          });
        }}>Accept</Button>
        <Button variant="outline" colorScheme="red" size="sm" onClick={() => { }}>Reject</Button>
      </div>
    )
  }
  else {
    return <AiOutlineUserAdd color="white" size={"25px"} onClick={
      () => {
        APIRequests.sendFriendRequest(id).then((res) => {
          if (res.status == 200) {
            if (res.data.status == "SENT") {
              toast.success("Friend request sent!", toastConfig);
              dispatch(addStatus({
                i: selectedUser,
                status: "SENT"
              }));
            }
            else if ( res.data.status == "ACCEPTED") {
              toast.success("Friend request accepted!", toastConfig);
              dispatch(addStatus({
                i: selectedUser,
                status: "ACCEPTED"
              }));
            }

          }
        }).catch((err) => {
          console.log("Error sending friend request", err);
          toast.error("Error sending friend request", toastConfig);
        });
      }
    } />
  }
}

