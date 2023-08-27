import { useContext, useState } from "react"
import { UserContext } from "../UserContext"
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";

export default function AccountPage() {
    const [redirect, setRedirect] = useState(null);
    const { user, ready, setUser } = useContext(UserContext);
    let { subpage } = useParams();
    if (subpage === undefined) {
        subpage = "profile";
    }

    async function logout() {
        await axios.post("/api/logout");
        setUser(null);
        setRedirect("/");
    }

    if (redirect) {
        return <Navigate to={redirect} />
    }

    if (!ready) {
        return "Loading..."
    }

    if (ready && !user && !redirect) {
        return <Navigate to={'/login'} />
    }

    function linkClasses(type) {
        let classes = "inline-flex items-center gap-1 py-2 px-6 rounded-full";
        if (type === subpage) {
            classes += " bg-primary text-white rounded-full"
        } else {
            classes += " bg-gray-100"
        }
        return classes
    }

    return (
        <div>
            <nav className="flex w-full gap-2 mt-8 justify-center mb-8">
                <Link className={linkClasses("profile")} to={'/account'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    My Profile
                </Link>
                <Link className={linkClasses("bookings")} to={'/account/bookings'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                    </svg>

                    My Bookings
                </Link>
                <Link className={linkClasses("places")} to={'/account/places'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
                    </svg>


                    My Places
                </Link>
            </nav>
            {subpage === "profile" && (
                <div className="text-center max-w-lg mx-auto">
                    Logged in as {user.name} ({user.email})<br />
                    <button className="primary max-w-sm mt-2" onClick={logout}>Logout</button>
                </div>
            )}
            {subpage === "places" && (
                <PlacesPage />
            )}
        </div>
    )
}