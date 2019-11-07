import React from "react";
import styles from "./Result.module.css";
import QRCode from "qrcode.react";
import { Card, Button } from "@material-ui/core";

interface Props {
  url: string;
  onAdvance: () => void;
}

const Result: React.FC<Props> = ({ url, onAdvance, children }) => (
  <div className={styles.container}>
    <Button
      variant="contained"
      color="primary"
      className={styles.button}
      onClick={onAdvance}
    >
      Start Over
    </Button>
    <Card className={styles.card}>
      <p>
        Open the camera app on your phone and scan the code below. It will
        direct you to a link to the photo.{" "}
        <strong>This link will expire in 15 minutes.</strong> We will be mailing
        physical copies of all the photos as well.
      </p>
      <span className={styles.qrCode}>
        <QRCode value={url} size={200} />
      </span>
    </Card>
    {children}
    <Button
      variant="contained"
      color="primary"
      className={styles.button}
      onClick={onAdvance}
    >
      Start Over
    </Button>
  </div>
);

export default Result;
