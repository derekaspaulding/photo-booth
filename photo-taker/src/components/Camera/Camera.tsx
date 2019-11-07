import React from "react";
import Webcam from "react-webcam";
import styles from "./Camera.module.css";

interface CameraProps {
  onCapture: (images: string[]) => void;
}

interface CountdownProps {
  callback: () => void;
  time: number;
}

const Countdown: React.FC<CountdownProps> = ({ callback, time }) => {
  const [counter, setCounter] = React.useState(time);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const newTime = counter - 1;

      if (newTime === 0) {
        callback();
      } else {
        setCounter(newTime);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [callback, counter]);

  return counter === 0 ? null : (
    <span className={styles.counter}>{counter}</span>
  );
};

const videoConstraints = {
  facingMode: "user",
  height: 1024,
  width: 768
};

const Camera: React.FC<CameraProps> = ({ onCapture }) => {
  const webcamRef = React.useRef(null);
  const [showFlash, setShowFlash] = React.useState(false);
  const [images, setImages] = React.useState<string[]>([]);

  const capture = React.useCallback(async () => {
    if (webcamRef && webcamRef.current) {
      setShowFlash(true);
      const imageSrc: string = (webcamRef as any).current.getScreenshot();
      if (images.length < 3) {
        setImages([...images, imageSrc]);
        setTimeout(() => setShowFlash(false), 500);
      } else {
        setTimeout(() => {
          setShowFlash(false);
          onCapture([...images, imageSrc]);
        }, 500);
      }
    }
  }, [webcamRef, images, onCapture]);

  return (
    <div className={styles.videoContainer}>
      <Webcam
        ref={webcamRef}
        className={styles.video}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        mirrored={true}
      />
      <Countdown
        key={images.length}
        time={images.length === 0 ? 10 : 5}
        callback={capture}
      />
      {showFlash && <div className={styles.flash} />}
    </div>
  );
};

export default Camera;
