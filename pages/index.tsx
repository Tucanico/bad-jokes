import Avatar from "@/components/Avatar";
import Cards from "@/components/Cards";
import Intro from "@/components/Intro";
import { useState } from "react";
import styles from "@/styles/general.module.css";
import Footer from "@/components/Footer";
import { formatJoke } from "@/lib/utils";
import Image from "next/image";
import Modal from "@/components/Modal";
import useSound from "use-sound";

export default function Home() {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [go, setGo] = useState<boolean>(false);
  const [joke, setJoke] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [avatarSelect, setAvatarSelect] = useState<string>("greet");
  const [laugh] = useSound("/Media/Sounds/laugh2.mp3");
  const [splat] = useSound("/Media/Sounds/punch1.mp3");

  const getJoke = async () => {
    try {
      setAvatarSelect("stressed");
      const res = await fetch("/api/completion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ words: selectedWords }).toLowerCase(),
      }).then((res) => res.json());
      setJoke(formatJoke(res.data.choices[0].text));
      setIsOpen(true);
      splat();
      setTimeout(() => {
        laugh();
      }, 800);

      if (typeof window != "undefined" && window.document) {
        document.body.style.overflow = "hidden";
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className={styles.background}></div>
      <div className={styles.content}>
        <div className={styles.title}>
          <Image
            src={
              "https://res.cloudinary.com/dtl48kr1u/image/upload/v1699270985/bad-jokes/title2_s1prxl.png"
            }
            title="title"
            alt="title"
            width={"0"}
            height={"0"}
            sizes="100vw"
            className={styles.title_img}
          />
        </div>

        {!go && <Intro setGo={setGo} />}
        {go && (
          <div>
            {isOpen && (
              <Modal
                setIsOpen={setIsOpen}
                joke={joke}
                setAvatarSelect={setAvatarSelect}
                setSelectedWords={setSelectedWords}
              />
            )}
            <div className={styles.instructions}>
              <p>Select up to three words to create your bad joke!</p>
            </div>
            <Avatar
              selectedWords={selectedWords}
              getJoke={getJoke}
              avatarSelect={avatarSelect}
              setAvatarSelect={setAvatarSelect}
            />
            <Cards
              selectedWords={selectedWords}
              setSelectedWords={setSelectedWords}
            />
          </div>
        )}
        <Footer />
      </div>
    </>
  );
}
