import { Dispatch, SetStateAction } from "react";
import Card from "./Card";
import styles from "@/styles/card.module.css";
import { WORDS } from "@/lib/words";

interface Props {
  selectedWords: string[];
  setSelectedWords: Dispatch<SetStateAction<string[]>>;
}

export default function Cards({ selectedWords, setSelectedWords }: Props) {
  return (
    <>
      <div className={styles.card_container}>
        {WORDS.map((word) => {
          return (
            <Card
              key={word}
              word={word}
              selectedWords={selectedWords}
              setSelectedWords={setSelectedWords}
            />
          );
        })}
      </div>
    </>
  );
}
