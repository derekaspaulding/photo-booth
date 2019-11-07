import React from "react";
import List from "@material-ui/core/List";
import { Card, Button } from "@material-ui/core";
import styles from "./Instructions.module.css";

interface Props {
  onAdvance: () => void;
}

const Instructions: React.FC<Props> = ({ onAdvance }) => {
  return (
    <div className={styles.container}>
      <div>
        <Card className={styles.card}>
          <ol>
            <li>Grab some props.</li>
            <li>
              Get Ready. When you start, a timer will count down from 10 on the
              first photo and 5 on the rest. It will take 4 photos total
            </li>
            <li>
              After the photos are taken, they will display on the screen along
              with a QR code to scan to download to your own device. We will
              also send out physical photos as long as we can tell who's in
              them.
            </li>
            <li>Press the button below to start!</li>
          </ol>
        </Card>
        <Button
          variant="contained"
          color="primary"
          className={styles.button}
          onClick={onAdvance}
        >
          Start!
        </Button>
      </div>
    </div>
  );
};

export default Instructions;
