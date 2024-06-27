import React, { useState } from 'react';
import "./friends.css"

const Friends = ({friends}) => {
    return (
        <div>
            <ul className="friends-list">
                {friends.map((friend) => (
                    <li key={friend._id} className="friend-item">
                        <span className="friend-name">{friend.name}</span>
                    </li>
                ))}

                {friends && friends.length === 0 && <li className="no-friends" style={{
                    textAlign: 'center',
                }}>No friends</li>}
            </ul>
        </div>
    );
};

export default Friends;