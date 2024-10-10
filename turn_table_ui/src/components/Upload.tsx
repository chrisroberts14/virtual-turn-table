import React, {useState} from "react";
import {Button} from "@nextui-org/button";
import {Card, CardBody, CardFooter, CardHeader} from "@nextui-org/card"
import {Input} from "@nextui-org/input";
import {Divider} from "@nextui-org/divider"

const Upload = () => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {};


    return (
        <>
        <div
            style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
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
        </div>
        </>
    );
}

export default Upload;
