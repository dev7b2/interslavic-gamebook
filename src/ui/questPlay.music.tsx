import * as React from "react";

function getRandom<T>(list: T[]): T {
  const i = Math.floor(Math.random() * list.length);
  return list[i];
}

function useDocumentHidden() {
  const [hidden, setHidden] = React.useState(document.visibilityState === "hidden");

  React.useEffect(() => {
    const update = () => {
      setHidden(document.visibilityState === "hidden");
    };
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  });

  return hidden;
}

export function Music({ urls }: { urls: string[] }) {
  const audioElement = React.useRef<HTMLAudioElement | null>(null);
  const [url, setUrl] = React.useState(getRandom(urls));
  const isHidden = useDocumentHidden();

  React.useEffect(() => {
    if (isHidden) {
      if (audioElement.current) {
        void audioElement.current.pause();
      }
      return;
    }

    const play = () => {
      if (!audioElement.current) {
        return;
      }
      void audioElement.current.play();
    };
    document.addEventListener("click", play);
    document.addEventListener("touchstart", play);
    play();
    return () => {
      document.removeEventListener("click", play);
      document.removeEventListener("touchstart", play);
    };
  }, [url, isHidden]);

  return (
    <audio
      autoPlay={!isHidden}
      controls={false}
      onEnded={() => {
        setUrl(getRandom(urls));
      }}
      src={url}
      ref={audioElement}
    />
  );
}
