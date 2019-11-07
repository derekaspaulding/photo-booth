import React from "react";
import Camera from "./components/Camera";
import QRCode from "qrcode.react";
import Instructions from "./components/Instructions";
import { CircularProgress } from "@material-ui/core";
import styles from "./App.module.css";
import { style } from "@material-ui/system";
import Result from "./components/Result";

enum STEP {
  INSTRUCTIONS,
  TAKE_PHOTOS,
  DOWNLOAD
}

const getNextStep = (currentStep: STEP): STEP => {
  switch (currentStep) {
    case STEP.INSTRUCTIONS:
      return STEP.TAKE_PHOTOS;
    case STEP.TAKE_PHOTOS:
      return STEP.DOWNLOAD;
    case STEP.DOWNLOAD:
      return STEP.INSTRUCTIONS;
    default:
      return currentStep;
  }
};

const App = () => {
  const [url, setUrl] = React.useState<string>("");
  const [currentStep, setCurrentStep] = React.useState(STEP.INSTRUCTIONS);
  const [loading, setLoading] = React.useState(false);
  const [imageData, setImageData] = React.useState("");

  const handleCapture = async (images: string[]) => {
    setLoading(true);

    const uploadImage = async (image: string) => {
      const response = await fetch(
        "https://mq8l4u8s7k.execute-api.us-east-2.amazonaws.com/Prod/upload",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            photos: [image]
          })
        }
      );
      const {
        shortUrls: [newUrl]
      } = await response.json();
      setUrl(newUrl);
      setImageData(image);
      console.log(newUrl);
    };

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    const imgs: HTMLImageElement[] = await Promise.all(
      images.map(image => {
        return new Promise(resolve => {
          const imageContainer = document.createElement("img");
          imageContainer.onload = function() {
            resolve(this as HTMLImageElement);
          };
          imageContainer.src = image;
        });
      })
    );

    ctx.canvas.height = 20 + imgs.reduce((acc, img) => acc + img.height, 0);
    ctx.canvas.width =
      20 + imgs.reduce((acc, img) => Math.max(acc, img.width), 0);

    let height = 0;

    imgs.forEach(img => {
      ctx.drawImage(img, 10, height + 10);
      height += img.height;
    });

    const imageStrip = canvas.toDataURL("image/jpeg");
    await uploadImage(imageStrip);
    setLoading(false);
    setCurrentStep(getNextStep(currentStep));
  };

  const advance = () => {
    console.log("next step");
    setCurrentStep(getNextStep(currentStep));
  };

  switch (currentStep) {
    case STEP.INSTRUCTIONS:
      return <Instructions onAdvance={advance} />;
    case STEP.TAKE_PHOTOS:
      return loading ? (
        <div className={styles.loadingContainer}>
          <CircularProgress
            color="secondary"
            className={styles.loading}
            size={400}
          />
        </div>
      ) : (
        <Camera onCapture={handleCapture} />
      );
    case STEP.DOWNLOAD:
      return (
        <Result url={url} onAdvance={advance}>
          <div className={styles.imageContainer}>
            <img src={imageData} alt="" className={styles.image} />
          </div>
        </Result>
      );
  }
};

export default App;
