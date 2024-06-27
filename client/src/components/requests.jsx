import React, { useState } from 'react';
import "./friends.css"

import { useSelector, useDispatch } from 'react-redux';
import { addStatusById } from "@/redux/reducers/chatReducer";
import APIRequests from '@/api';
import { toast } from 'react-toastify';

const Requests = ({ requests }) => {

    const dispatch = useDispatch();

    const acceptRequest = (id) => {
        APIRequests.acceptFriendRequest(id).then((res) => {
            if (res.status === 200) {
                dispatch(addStatusById({ id, status: "ACCEPTED" }));
            }
        }
        ).catch((err) => {
            console.log(err);
            toast.error("Something went wrong")
        });
    };

    return (
        <div>
            <ul className="friend-requests-list">
                {requests.map((request) => (
                    <li key={request._id} className="friend-request">
                        <div className="request-info">
                            <span className="request-name">{request.name}</span>
                        </div>
                        <div className="request-actions">
                            <button className="accept-button" onClick={() => acceptRequest(request._id)}>Accept</button>
                            <button className="reject-button" onClick={() => rejectRequest(request._id)}>Reject</button>
                        </div>
                    </li>
                ))}
                {requests && requests.length === 0 && <li className="no-requests" style={{
                    textAlign: 'center',
                }}>No friend requests</li>}
            </ul>
        </div>
    )
}

export default Requests;