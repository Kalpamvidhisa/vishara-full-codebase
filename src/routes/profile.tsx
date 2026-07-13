import { getUser } from "@/lib/auth";

export default function Profile() {
    const user = getUser();

    return (
        <div>
            <h1>My Profile</h1>

            {user ? (
                <>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Phone:</strong> {user.phone}</p>
                </>
            ) : (
                <p>No user logged in</p>
            )}
        </div>
    );
}