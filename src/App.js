import Webcam from "react-webcam";
import React from "react";

const WebcamStreamCapture = () => {
    const webcamRef = React.useRef(null);
    const mediaRecorderRef = React.useRef(null);
    const [capturing, setCapturing] = React.useState(false);
    const [recordedChunks, setRecordedChunks] = React.useState([]);
    const [imgSrc, setImgSrc] = React.useState(null);
    const [urll, setUrll] = React.useState(null)

    React.useEffect(() => {
        console.log('hello', urll);
    }, [urll]);
    
    const capture = React.useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
    }, [webcamRef, setImgSrc]);

    const handleDataAvailable = React.useCallback(
        ({ data }) => {
            if (data.size > 0) {
                setRecordedChunks((prev) => prev.concat(data));
            }
        },
        [setRecordedChunks]
    );

    const handleStartCaptureClick = React.useCallback(() => {
        setCapturing(true);
        mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
            mimeType: "video/webm"
        });
        mediaRecorderRef.current.addEventListener(
            "dataavailable",
            handleDataAvailable
        );
        mediaRecorderRef.current.start();
    }, [webcamRef, setCapturing, mediaRecorderRef, handleDataAvailable]);

    const handleAgainCaptureClick = () => {
        setRecordedChunks([]);
        setImgSrc(null);
        setUrll(null);
    }

    const handleStopCaptureClick = React.useCallback(() => {
        mediaRecorderRef.current.stop()
        const blob = new Blob(recordedChunks, {
            type: "video/webm"
        })
        setUrll(URL.createObjectURL(blob))
        setCapturing(false)
        console.log(recordedChunks , urll)
    }, [mediaRecorderRef, setCapturing, recordedChunks, setUrll, urll]);

    const handleDownload = React.useCallback(() => {
        if (recordedChunks.length) {
            const blob = new Blob(recordedChunks, {
                type: "video/webm"
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.href = url;
            a.download = "react-webcam-stream-capture.webm";
            a.click();
            window.URL.revokeObjectURL(url);
            setRecordedChunks([]);
        }
    }, [recordedChunks]);

    return (
        <div className='m-5'>
            <div>
                {!imgSrc && recordedChunks.length === 0 && (<Webcam audio={true} ref={webcamRef} />)}
                {imgSrc && (<img src={imgSrc} alt='' />)}
                {recordedChunks.length > 0 && urll && (<video src={urll} controls loop></video>)}
            </div>
            {capturing && (<button onClick={handleStopCaptureClick}>Stop Capture</button>)}
            { !capturing && recordedChunks.length === 0 && !imgSrc && (<button onClick={handleStartCaptureClick}>Capture Video</button>)}
            {(recordedChunks.length > 0 || imgSrc) && (<button onClick={handleAgainCaptureClick}>Capture Again</button>)}
            { !capturing && recordedChunks.length === 0 && !imgSrc && (<button onClick={capture}>Capture photo</button>)}
            { imgSrc && (<button>Send Elsewhere</button>)}
            {recordedChunks.length > 0 && (
                <button onClick={handleDownload}>Download</button>
            )}
        </div>
    );
};

export default WebcamStreamCapture