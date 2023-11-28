import React, {useCallback} from "react";
import "./styles.css";
import {useDropzone} from "react-dropzone";
import {BiPaperclip} from "react-icons/bi";

const Dropzone = ({setFiles}) => {
    const onDrop = useCallback( (acceptedFiles) => {
        setFiles(acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })));
    }, []);

    const {getRootProps, getInputProps } = useDropzone({onDrop})

    return (
        <div {...getRootProps()} className="dropzone__main-input">
            <input {...getInputProps()} />
            <BiPaperclip size={20}/>
        </div>
    )
};

export default Dropzone;
