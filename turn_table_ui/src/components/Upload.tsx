import React, {useState} from "react";
import {Button} from "@nextui-org/button";
import {Card, CardBody, CardFooter, CardHeader} from "@nextui-org/card"
import {Input} from "@nextui-org/input";
import {Divider} from "@nextui-org/divider"
import axios from "axios";

// @ts-ignore
const Upload = ({setAlbumURI}) => {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (file) {
            setIsUploading(true);
            const formData = new FormData();
            formData.append('file', file);
            axios.post(import.meta.env.VITE_BFF_ADDRESS + "image_to_uri/", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(function (response) {
                    setAlbumURI(response.data);
                    setIsUploading(false);
                    setFile(null);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    };


    return (
        <>{!isUploading ? <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50vh',
            }}
        >
            <Card className="max-w-[400px]">
                <CardHeader className="flex gap-3">
                    <Input type={"file"} onChange={handleFileChange} accept={".png, .jpg"}></Input>
                </CardHeader>

                <Divider/>
                <CardBody>
                    {
                        file && (
                            <section>
                                File details:
                                <ul>
                                    <li>Name: {file.name}</li>
                                    <li>Type: {file.type}</li>
                                    <li>Size: {file.size} bytes</li>
                                </ul>
                            </section>
                        )
                    }
                </CardBody>
                <Divider/>
                <CardFooter>
                    {
                        file && (
                            <Button
                                onClick={handleUpload}
                                className="submit"
                            >Upload a file</Button>
                        )}
                </CardFooter>
            </Card>
        </div> : <div>Uploading...</div>}

        </>
    );
}

export default Upload;
