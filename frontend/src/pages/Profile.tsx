import React, { FC, useEffect, useState } from "react";
import Layout from "src/components/Layout";

import "src/styles/profile.css";
import "src/common/React/styles/form.css";

import { useMutation, useQuery } from "react-query";
import { getUserProfile, saveUserProfile } from "src/common/React/api/query/user";

import Button from "src/common/React/components/Button";
import { spawnNotification } from "src/common/React/helpers/notification";

const Profile: FC = () => {
    const { data: user, refetch: refetchUser } = useQuery("user", getUserProfile);
    const saveUser = useMutation(saveUserProfile);

    const handleSaveProfile = async () => {
        if (confirmPassword !== password) {
            spawnNotification({ text: "Passwords don't match", type: "error" })
            return;
        }

        await saveUser.mutate({ firstName, lastName, username, password }, { onSuccess: () => refetchUser() });
    }

    const handleCancel = async () => {
        setFirstName(user?.firstName || firstName);
        setLastName(user?.lastName || lastName);
        setUsername(user?.username || username);
        setPassword("");
        setConfirmPassword("");
    }

    useEffect(() => {
        setFirstName(user?.firstName || "");
        setLastName(user?.lastName || "");
        setUsername(user?.username || "");
    }, [user])

    const [firstName, setFirstName] = useState(user?.firstName || "");
    const [lastName, setLastName] = useState(user?.lastName || "");
    const [username, setUsername] = useState(user?.username || "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    return (
        <>
            <Layout requireAuthentication={true}>
                <div className="profile-container">
                    <form className="form--profile">

                        <div className="form-fname">
                            <label> First Name </label>
                            <input className="form-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        </div>

                        <div className="form-lname">
                            <label> Last Name </label>
                            <input className="form-input" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </div>

                        <div className="form-username">
                            <label> Username </label>
                            <input className="form-input" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>

                        <div className="form-password">
                            <label> New Password </label>
                            <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>

                        <div className="form-confpassword">
                            <label> Confirm New Password </label>
                            <input type="password" className="form-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>

                        <div className="form-cancel">
                            <Button onClick={handleCancel} size="fill"> Cancel </Button>
                        </div>

                        <div className="form-save">
                            <Button onClick={handleSaveProfile} size="fill"> Save </Button>
                        </div>

                    </form>
                </div>
            </Layout>
        </>
    );
};

export default Profile;
