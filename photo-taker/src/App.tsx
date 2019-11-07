import React from "react";
import Camera from "./components/Camera";
import QRCode from "qrcode.react";

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
      return (
        <button
          style={{ color: "#fff", fontSize: "100px" }}
          onClick={() => advance()}
        >
          Instructions
        </button>
      );
    case STEP.TAKE_PHOTOS:
      return loading ? (
        <span>"Loading..."</span>
      ) : (
        <Camera onCapture={handleCapture} />
      );
    case STEP.DOWNLOAD:
      return (
        <div>
          <button
            style={{
              color: "#fff",
              fontSize: "100px",
              backgroundColor: "#000066"
            }}
            onClick={() => advance()}
          >
            Start Over
          </button>
          <QRCode value={url} size={600} />
        </div>
      );
  }
};

export default App;
