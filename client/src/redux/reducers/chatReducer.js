
import { createSlice } from "@reduxjs/toolkit";

const chat = createSlice({
    name: "chat",
    initialState: {
        // user: null,
        isOpen: false,
        users: [],
        selectedUser: null
    },
    reducers: {
        setUser: (state, action) => {
            state.selectedUser = action.payload;
        },
        toggleChat: (state, action) => {
            state.isOpen = action.payload;
        },
        addStatus: (state, action) => {
            const { i, status } = action.payload;
            state.users[i].status = status;

        },
        setUsers: (state, action) => {
            state.users = action.payload;
        },
        addStatusById : (state, action) => {
            const { id, status } = action.payload;
            const i = state.users.findIndex(user => user._id === id);
            state.users[i].status = status;
        }
    }
});

export const chatReducer = chat.reducer;

export const { setUser, toggleChat, addStatus, setUsers, addStatusById } = chat.actions;