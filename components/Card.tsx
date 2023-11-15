import styles from "@/styles/card.module.css";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import useSound from "use-sound";

interface Props {
  word: string;
  selectedWords: string[];
  setSelectedWords: Dispatch<SetStateAction<string[]>>;
}

export default function Card({ word, selectedWords, setSelectedWords }: Props) {
  const [showError, setShowError] = useState<boolean>(false);
  const img: string = word.toLowerCase();
  const [splat] = useSound("/Media/Sounds/pick.mp3");

  const selectWord = () => {
    if (selectedWords.length <= 2 && !selectedWords.includes(word)) {
      splat();
      setSelectedWords([...selectedWords, word]);
    } else if (selectedWords.includes(word)) {
      setSelectedWords((current) =>
        current.filter((wordz) => {
          return wordz !== word;
        })
      );
    } else {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 1000);
    }
  };

  return (
    <>
      <a onClick={selectWord}>
        <div
          className={
            selectedWords.includes(word) ? styles.card_clicked : styles.card
          }
        >
          {selectedWords.includes(word) ? (
            <Image
              src={`https://res.cloudinary.com/dtl48kr1u/image/upload/v1699373983/bad-jokes/Words-icons/${img}-on.png`}
              title={word}
              alt={word}
              width={80}
              height={80}
              sizes="100vw"
              priority={true}
              className={styles.card_img_on}
              style={{ display: "block" }}
            />
          ) : (
            <Image
              src={`https://res.cloudinary.com/dtl48kr1u/image/upload/v1699373983/bad-jokes/Words-icons/${img}.png`}
              title={word}
              alt={word}
              width={80}
              height={80}
              sizes="100vw"
              priority={true}
              className={styles.card_img}
            />
          )}
          <Image
            src={`https://res.cloudinary.com/dtl48kr1u/image/upload/v1699373983/bad-jokes/Words-icons/${img}-on.png`}
            title={word}
            alt={word}
            width={80}
            height={80}
            sizes="100vw"
            priority={true}
            className={styles.card_img_on}
          />
          <h1 className={styles.card_title}>{word}</h1>
          {showError && (
            <span className={styles.tooltiptext}>Max words number reached</span>
          )}
        </div>
      </a>
    </>
  );
}
