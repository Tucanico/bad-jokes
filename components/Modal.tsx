import styles from "@/styles/modal.module.css";
import Image from "next/image";
import { Dispatch, SetStateAction, useCallback, useEffect } from "react";

interface Props {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  joke: string | null;
  setAvatarSelect: Dispatch<SetStateAction<string>>;
  setSelectedWords: Dispatch<SetStateAction<string[]>>;
}

export default function Modal({
  setIsOpen,
  joke,
  setAvatarSelect,
  setSelectedWords,
}: Props) {
  // Every way of closing goes through here; the background click used to skip the
  // scroll unlock and leave the page frozen.
  const close = useCallback(() => {
    setIsOpen(false);
    setAvatarSelect("good");
    document.body.style.overflow = "unset";
    setSelectedWords([]);
  }, [setIsOpen, setAvatarSelect, setSelectedWords]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close]);

  return (
    <>
      <div className={styles.modal_background} onClick={close} />
      <div className={styles.modal}>
        <Image
          src={
            "https://res.cloudinary.com/dtl48kr1u/image/upload/v1699006524/bad-jokes/balloon_hrsfyq.png"
          }
          title="Avatar"
          alt="Avatar"
          width="0"
          height="0"
          sizes="100vw"
          className={styles.modal_balloon}
        />
        <div>
          <h4>{joke}</h4>
        </div>

        <button
          type="button"
          aria-label="Close"
          className={styles.close_button}
          onClick={close}
        >
          X
        </button>
      </div>
    </>
  );
}
