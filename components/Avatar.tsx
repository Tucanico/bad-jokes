/* eslint-disable react-hooks/exhaustive-deps */
import Image from "next/image";
import styles from "@/styles/card.module.css";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MIN_WORDS } from "@/lib/words";

interface Props {
  selectedWords: string[];
  getJoke: () => void;
  avatarSelect: string;
  setAvatarSelect: Dispatch<SetStateAction<string>>;
}

export default function Avatar({
  selectedWords,
  getJoke,
  avatarSelect,
  setAvatarSelect,
}: Props) {
  const [showError, setShowError] = useState<boolean>(false);

  const getJokeHandler = () => {
    if (selectedWords.length < MIN_WORDS) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 1500);
    } else {
      getJoke();
    }
  };

  useEffect(() => {
    if (selectedWords.length !== 0) {
      setAvatarSelect("good");
    } else {
      setAvatarSelect("greet");
    }
  }, [selectedWords]);
  return (
    <>
      <div className={styles.avatar_container}>
        <div className={styles.avatar}>
          {avatarSelect === "stressed" ? (
            <Image
              src={
                "https://res.cloudinary.com/dtl48kr1u/image/upload/v1698932768/bad-jokes/Avatar/stressed_wv9yjt.png"
              }
              title="Avatar"
              alt="Avatar"
              width={"150"}
              height={"150"}
            />
          ) : (
            <div>
              {avatarSelect === "greet" ? (
                <Image
                  src={
                    "https://res.cloudinary.com/dtl48kr1u/image/upload/v1699259725/bad-jokes/Avatar/greet_h2mf1g.png"
                  }
                  title="Avatar"
                  alt="Avatar"
                  width={"150"}
                  height={"150"}
                />
              ) : (
                <Image
                  src={
                    "https://res.cloudinary.com/dtl48kr1u/image/upload/v1698932768/bad-jokes/Avatar/good_op827j.png"
                  }
                  title="Avatar"
                  alt="Avatar"
                  width={"150"}
                  height={"150"}
                />
              )}
            </div>
          )}
          {selectedWords[0] && (
            <div className={styles.balloon0}>
              <p>{selectedWords[0]}</p>
            </div>
          )}
          {selectedWords[1] && (
            <div className={styles.balloon1}>
              <div>
                <p>{selectedWords[1]}</p>
              </div>
            </div>
          )}
          {selectedWords[2] && (
            <div className={styles.balloon2}>
              <div>
                <p>{selectedWords[2]}</p>
              </div>
            </div>
          )}
        </div>
        <button type="button" onClick={getJokeHandler} className={styles.go}>
          {showError && (
            <span className={styles.tooltiptext}>
              Select at least two words
            </span>
          )}
          <span className={`h1 ${styles.go_label}`}>GO!</span>
        </button>
      </div>
      <button type="button" onClick={getJokeHandler} className={styles.go_out}>
        {showError && (
          <span className={styles.tooltiptext}>Select at least two words</span>
        )}
        <span className={`h1 ${styles.go_label}`}>GO!</span>
      </button>
    </>
  );
}
