import { useFirebase } from "@/contexts/FirebaseContext";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";

export const useStorage = ({ subPath }: { subPath?: string }) => {
  const { app } = useFirebase();
  const [images, setImages] = useState<any>([]);

  useEffect(() => {
    if (images.length > 0) {
      return;
    }

    const fetchData = async () => {
      if (!app) {
        return;
      }

      //gs://vrw-alteration.appspot.com/alterations

      const storage = getStorage(app);
      //todo: move to env

      const path = subPath
        ? `gs://vrw-alteration.appspot.com/${subPath}`
        : "gs://vrw-alteration.appspot.com";
      const storageRef = ref(storage, path);
      try {
        const res = await listAll(storageRef);
        const imgs = [];

        for (const itemRef of res.items) {
          try {
            const url = await getDownloadURL(itemRef);
            imgs.push(url);
          } catch (error) {
            console.error("Error getting download URL:", error);
          }
        }

        const resImgs = imgs.map((img: string, i: number) => {
          const thumbnail = {
            src: img,
            width: 100,
            height: 100,
            isSelected: false,
            caption: `image ${i}`,
          };

          return thumbnail;
        });

        setImages(resImgs);
      } catch (error) {
        console.error("Error listing items:", error);
      }
    };

    fetchData();
  }, [app, images, subPath]);

  return {
    images,
  };
};
