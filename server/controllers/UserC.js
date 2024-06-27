import mongoose from "mongoose";
import User from "../models/UserSchema.js";



class UserController {
    constructor() { }

    removeFriend = async (req, res) => {
        try {
            const uid = new mongoose.Types.ObjectId(req.userID);
            const fid = new mongoose.Types.ObjectId(req.params.id);
            const user = await User.findById(uid);
            const friendUser = await User.findById(fid);
            if (!user) {
                return res.status(400).json({ message: "User not found" });
            }
            else if (!friendUser) {
                return res.status(400).json({ message: "Friend user not found" });
            }


            const friendRelationForUser = user.friends.find(friend => friend.friendId.toString() === fid.toString());
            const friendRelationForFriendUser = friendUser.friends.find(friend => friend.friendId.toString() === uid.toString());

            console.log(friendRelationForUser, friendRelationForFriendUser)

            if (!friendRelationForUser) {
                return res.status(400).json({ message: "Friend not found" });
            }
            else if (!friendRelationForFriendUser) {
                return res.status(400).json({ message: "User not found" });
            }

            const index = user.friends.indexOf(friendRelationForUser);
            user.friends.splice(index, 1);
            await user.save();

            const index2 = friendUser.friends.indexOf(friendRelationForFriendUser);
            friendUser.friends.splice(index2, 1);
            await friendUser.save();

            return res.status(200).json({ message: "Friend removed successfully" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Server error' });
        }
    }

    async updateLocation(req, res) {
        try {
            // console.log("updateLocation")
            const { location } = req.body;
            const uid = req.userID;
            console.log(location, uid)
            const user = await User.findById(uid);
            console.log(user)
            if (!user) {
                return res.status(400).json({ message: "User not found" });
            }
            user.location.latitude = location.latitude;
            user.location.longitude = location.longitude;
            await user.save();
            return res.status(200).json({ message: "Location updated successfully" });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async getHome(req, res) {
        try {
            const uid = req.userID;
            const user = await User.findById(uid);
            if (!user) {
                return res.status(400).json({ message: "User not found" });
            }
            return res.status(200).json({ location: user.location ?? null });
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }



    async getAll(req, res) {
        try {
            const uid = new mongoose.Types.ObjectId(req.userID);
    
            const users = await User.aggregate([
                {
                    $match: {
                        _id: { $ne: uid },
                        location: { $ne: null }
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        let: { userId: "$_id" },
                        pipeline: [
                            { $match: { _id: uid } },
                            {
                                $addFields: {
                                    friendRelationForAuthUser: {
                                        $filter: {
                                            input: "$friends",
                                            as: "friendEntry",
                                            cond: { $eq: ["$$friendEntry.friendId", "$$userId"] }
                                        }
                                    }
                                }
                            },
                            {
                                $project: {
                                    friendStatusForAuthUser: { $arrayElemAt: ["$friendRelationForAuthUser.status", 0] }
                                }
                            }
                        ],
                        as: "friendData"
                    }
                },
                {
                    $addFields: {
                        friendRelation: {
                            $filter: {
                                input: "$friends",
                                as: "friendEntry",
                                cond: { $eq: ["$$friendEntry.friendId", uid] }
                            }
                        }
                    }
                },
                {
                    $project: {
                        name: 1,
                        location: 1,
                        isFriend: {
                            $cond: [
                                { $eq: [{ $arrayElemAt: ["$friendRelation.status", 0] }, "ACCEPTED"] },
                                true,
                                false
                            ]
                        },
                        status: { $arrayElemAt: ["$friendData.friendStatusForAuthUser", 0] }
                    }
                }
            ]);
    
            return res.status(200).json({ users });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Server error' });
        }
    }
    
    

    async sendFriendRequest(req, res) {
        try {
            const uid = new mongoose.Types.ObjectId(req.userID);
            const fid = new mongoose.Types.ObjectId(req.params.id);
    
            if (!fid) {
                return res.status(400).json({ message: "Invalid user id" });
            }
    
            const user = await User.findById(uid);
            const friendUser = await User.findById(fid);
    
            if (!user) {
                return res.status(400).json({ message: "User not found" });
            }
            if (!friendUser) {
                return res.status(400).json({ message: "Friend user not found" });
            }
    
            const friendRelationForUser = user.friends.find(friend => friend.friendId.toString() === fid.toString());
            const friendRelationForFriendUser = friendUser.friends.find(friend => friend.friendId.toString() === uid.toString());
    
            // If both users have sent friend requests to each other
            if (friendRelationForUser && friendRelationForFriendUser) {
                friendRelationForUser.status = "ACCEPTED";
                friendRelationForFriendUser.status = "ACCEPTED";
                
                await user.save();
                await friendUser.save();
    
                return res.status(200).json({ message: "Friend request accepted", status: "ACCEPTED" });
            }
            
            // If only the user has sent a request (or no requests were sent yet)
            if (!friendRelationForUser) {
                user.friends.push({ friendId: fid, status: "SENT" });
                await user.save();
            }
    
            if (!friendRelationForFriendUser) {
                friendUser.friends.push({ friendId: uid, status: "PENDING" });
                await friendUser.save();
            }
    
            return res.status(200).json({ message: "Friend request sent successfully", status: "SENT" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Server error' });
        }
    }
    

    async acceptFriendRequest(req, res) {
        try {

            const uid = new mongoose.Types.ObjectId(req.userID);
            const fid = new mongoose.Types.ObjectId(req.params.id);

            if (!fid) {
                return res.status(400).json({ message: "Invalid user id" });
            }
            
            // Fetching user and friend user documents
            const user = await User.findById(uid);

            if (!user) {
                return res.status(400).json({ message: "User not found" });
            }

            // Check if friend request already exists or the users are already friends
            const friendRelation = user.friends.find(friend => friend.friendId.toString() === fid.toString());
            if (!friendRelation) {
                return res.status(400).json({ message: "Friend request not found" });
            }
            if (friendRelation.status === "ACCEPTED") {
                return res.status(400).json({ message: "You are already friends" });
            }

            // Update friend request to user as ACCEPTED
            friendRelation.status = "ACCEPTED";
            await user.save();

            // Update friend request to friend user as ACCEPTED
            
            const friend = await User.findById(fid);
            const friendRelationForFriendUser = friend.friends.find(friend => friend.friendId.toString() === uid.toString());
            friendRelationForFriendUser.status = "ACCEPTED";
            await friend.save();

            return res.status(200).json({ message: "Friend request accepted successfully" });

            
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Server error' });
        }
    }
    
    async addChatHistory(req, res) {
        try {
            const { message, sendId, recId } = req.body;
            // console.log("sendId", sendId, "recId", recId)
            const send = new mongoose.Types.ObjectId(sendId);
            const rec = new mongoose.Types.ObjectId(recId);
            // console.log("send", send, "rec", rec)
            // console.log("message", message)

            const sender = await User.findById(send);
            if (sender) {
                // find receiver in sender's friend list and save the message in chatHistory
                const friendRelation = sender.friends.find(friend => friend.friendId.toString() === rec.toString());
                if (friendRelation) {
                    friendRelation.chatHistory.push(message);
                    await sender.save();
                    const receiver = await User.findById(rec);
                    const friendRelationForReceiver = receiver.friends.find(friend => friend.friendId.toString() === send.toString());
                    friendRelationForReceiver.chatHistory.push(message);
                    await receiver.save();
                    return res.status(200).json({ message: "Message sent successfully" });
                }
                else {
                    return res.status(400).json({ message: "Friend not found" });
                }
            }
            else {
                return res.status(400).json({ message: "Sender not found" });
            }
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Server error' });
        }
    }

    async getChatHistory(req, res) {
        try {
            const { sendId, recId } = req.body;
            const send = new mongoose.Types.ObjectId(sendId);
            const rec = new mongoose.Types.ObjectId(recId);

            const sender = await User.findById(send);
            if (sender) {
                // find receiver in sender's friend list and save the message in chatHistory
                const friendRelation = sender.friends.find(friend => friend.friendId.toString() === rec.toString());
                if (friendRelation) {
                    return res.status(200).json({ chatHistory: friendRelation.chatHistory });
                }
                else {
                    return res.status(400).json({ message: "Friend not found" });
                }
            }
            else {
                return res.status(400).json({ message: "Sender not found" });
            }
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Server error' });
        }
    }
}

export default UserController;