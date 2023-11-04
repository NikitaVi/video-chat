import React, {useState} from "react";
import {BiHappyAlt, BiPaperPlane} from "react-icons/bi";
import EmojiPicker, {EmojiStyle} from "emoji-picker-react";
import Dropzone from "./components/Dropzone";

const Footer = ({submitForm, setValue, value, files, setFiles}) => {
    const [visible, setVisible] = useState(false);

    const changer = ({target: {value}}) => {
        setValue(value)
    }

    const onClick = (emojiData) => {
        setValue(
            (value) =>
                value + (emojiData.isCustom ? emojiData.unified : emojiData.emoji)
        );
    }

    return (
        <div className="chat__footer-container">
            {!!files.length && (
                <div className="chat__added-images">
                    {files.map((file, idx) => (
                        <img src={file.preview} className="chat__added-img-preview" alt={file.name} key={idx}/>
                    ))}
                </div>
            )}
            <div className="chat__message-container">
                <Dropzone setFiles={setFiles}/>
                <input
                    className="chat__input"
                    placeholder={"Write a message..."}
                    value={value}
                    onChange={changer}
                />
                <button onClick={() => setVisible((val => !val))} className="chat__button">
                    <BiHappyAlt size={20}/>
                </button>
                {visible && (
                    <div className="chat__emoji-picker">
                        <EmojiPicker
                            onEmojiClick={onClick}
                            autoFocusSearch={false}
                            emojiStyle={EmojiStyle.NATIVE}
                        />
                    </div>

                )}
                <button onClick={submitForm} className="chat__button">
                    <BiPaperPlane size={20}/>
                </button>
            </div>
        </div>
    )
};

export default Footer;
