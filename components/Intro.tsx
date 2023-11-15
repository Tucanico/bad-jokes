import styles from "@/styles/general.module.css";
import { Dispatch, SetStateAction } from "react";
import useSound from "use-sound";

interface Props {
  setGo: Dispatch<SetStateAction<boolean>>;
}

export default function Intro({ setGo }: Props) {
  const [swoosh] = useSound("/Media/Sounds/whoosh.mp3");
  return (
    <>
      <div className={styles.intro_div}>
        <div>
          <p>
            Do you want to soffocate your friends with horrible jokes but none
            come to mind?
          </p>
          <p>Then you are in the right place.</p>
        </div>
        <a
          onClick={() => {
            setGo(true);
            swoosh();
          }}
          className={styles.intro_go}
        >
          <div className={styles.intro_avatar}></div>
        </a>
      </div>
    </>
  );
}
