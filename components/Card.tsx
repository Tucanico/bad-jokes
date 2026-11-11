import styles from "@/styles/card.module.css";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import useSound from "use-sound";
import { MAX_WORDS, imageName } from "@/lib/words";

interface Props {
  word: string;
  selectedWords: string[];
  setSelectedWords: Dispatch<SetStateAction<string[]>>;
}

const ICON_BASE_URL =
  "https://res.cloudinary.com/dtl48kr1u/image/upload/v1699373983/bad-jokes/Words-icons";

export default function Card({ word, selectedWords, setSelectedWords }: Props) {
  const [showError, setShowError] = useState<boolean>(false);
  const img: string = imageName(word);
  const isSelected = selectedWords.includes(word);
  const [splat] = useSound("/Media/Sounds/pick.mp3", { volume: 0.3 });
  const [swoosh] = useSound("/Media/Sounds/swoosh.mp3", { volume: 0.3 });

  const selectWord = () => {
    if (selectedWords.length < MAX_WORDS && !isSelected) {
      splat();
      setSelectedWords([...selectedWords, word]);
    } else if (isSelected) {
      swoosh();
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

  // Icons are decorative (alt="") because the word is written right below them.
  return (
    <button
      type="button"
      onClick={selectWord}
      aria-pressed={isSelected}
      className={isSelected ? styles.card_clicked : styles.card}
    >
      {!isSelected && (
        <Image
          src={`${ICON_BASE_URL}/${img}.png`}
          title={word}
          alt=""
          width={80}
          height={80}
          className={styles.card_img}
        />
      )}
      {/* Doubles as the hover image of an unselected card (.card:hover in card.module.css). */}
      <Image
        src={`${ICON_BASE_URL}/${img}-on.png`}
        title={word}
        alt=""
        width={80}
        height={80}
        className={styles.card_img_on}
        style={isSelected ? { display: "block" } : undefined}
      />
      <span className={styles.card_title}>{word}</span>
      {showError && (
        <span className={styles.tooltiptext}>You can pick up to three words</span>
      )}
    </button>
  );
}
