import Avatar from "@/components/Avatar";
import Cards from "@/components/Cards";
import Intro from "@/components/Intro";
import { useRef, useState } from "react";
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
  const [laugh] = useSound("/Media/Sounds/laugh.mp3");
  const [splat] = useSound("/Media/Sounds/punch.mp3");

  // A ref, not state: every click is a paid Mistral call, and state would still read
  // "not loading" for clicks that land before the next render.
  const isLoading = useRef<boolean>(false);

  const getJoke = async () => {
    if (isLoading.current) return;
    isLoading.current = true;
    setAvatarSelect("stressed");
    try {
      const res = await fetch("/api/completion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ words: selectedWords }),
      });
      if (res.status === 429) {
        setJoke("Whoa, too many bad jokes! Give me a minute.");
        return;
      }
      const body = await res.json();
      if (!res.ok || typeof body.joke !== "string") {
        throw new Error(body.error ?? `Request failed with ${res.status}`);
      }
      setJoke(formatJoke(body.joke));
      splat();
      setTimeout(() => {
        laugh();
      }, 800);
    } catch (error) {
      console.error(error);
      setJoke("Oops, my joke machine broke. Try again!");
    } finally {
      setIsOpen(true);
      document.body.style.overflow = "hidden";
      isLoading.current = false;
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
