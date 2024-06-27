import React, { useState } from 'react';
import "./friends.css"

const Sent = ({ sent }) => {
    return (
        <div>
            <ul className="sent-follow-requests-list">
                {sent.map((request) => (
                    <li key={request._id} className="sent-follow-request">
                        <div className="request-info">
                            <span className="request-name">{request.name}</span>
                            {/* <span className={`request-status ${request.status}`}>{request.status === 'pending' ? 'Pending' : 'Accepted'}</span> */}
                        </div>
                    </li>
                ))}
                {sent && sent.length === 0 && <li className="no-sent-requests" style={{
                    textAlign: 'center',
                }}>No pending requests</li>}
            </ul>
        </div>
    )
}

export default Sent;