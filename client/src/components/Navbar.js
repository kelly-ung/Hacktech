import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth'; // import signOut
import { auth } from './firebase'; // import auth from firebase.js

export default function Navbar({ loggedIn, setLoggedIn }) {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOut(auth); // sign out from Firebase
            setLoggedIn(false); // update loggedIn state
            navigate('/'); // redirect to the home page or login page
        } catch (error) {
            console.error('Error signing out: ', error); // handle any sign out errors
        }
    };

    return (
        <nav className="nav">
            <div className="header"><Link to="/">Budgetnator</Link></div>
            <ul>
                <li>
                    <Link to='/Home'>Budget Tool</Link>
                </li>
                <li>
                    <Link to='/Resources'>Resources</Link>
                </li>
                <li>
                    <Link to='/ChatApp'>Gemini</Link>
                </li>
                {loggedIn ? (
                    <li>
                        <button className="signout-button" onClick={handleSignOut}>
                            Sign Out
                        </button>
                    </li>
                ) : (
                    <li>
                        <Link to="/AuthPage">Log In</Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}
