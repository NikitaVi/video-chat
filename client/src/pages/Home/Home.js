import React, {useState} from "react";
import {Link} from "react-router-dom";
import './Home.css'

const Home = () => {
    const [room, setRoom] = useState('');
    const [user, setUser] = useState('');

    const userChanger = ({target: {value}}) => {
        setUser(value)
    }

    const roomChanger = ({target: {value}}) => {
        setRoom(value)
    }

    const handleClick = (e) => {
        const isDisabled = !room || !user;

        if (isDisabled) e.preventDefault();
    };

    return (
        <div className="home__form-wrapper">
            <form className="home__form">
                <h1 style={{textAlign: "center"}}>Welcome</h1>
                <input
                    className="home__input"
                    placeholder={"Username"}
                    value={user}
                    onChange={userChanger}
                />
                <input
                    className="home__input"
                    placeholder={"Room"}
                    value={room}
                    onChange={roomChanger}
                />

                <Link
                    to={`/chat?room=${room}&user=${user}`}
                    className={(!room || !user) ? "home__sign-button disabled" : "home__sign-button"}
                    onClick={handleClick}
                >
                    Sign up!
                </Link>
            </form>
        </div>

    )
}

export default Home;
