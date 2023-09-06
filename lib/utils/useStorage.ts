import { useFirebase } from "@/contexts/FirebaseContext";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";

export const useStorage = () => {
  const { app } = useFirebase();
  const [images, setImages] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!app) {
        return;
      }

      const storage = getStorage(app);
      //todo: move to env
      const storageRef = ref(storage, "gs://vrw-alteration.appspot.com");
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

        const resImgs = imgs.map((img: string, i: number) => ({
          src: img,
          // width: 0,
          // height: 0,
          isSelected: false,
          caption: `image ${i}`,
        }));

        setImages(resImgs);
      } catch (error) {
        console.error("Error listing items:", error);
      }
    };

    fetchData();
  }, [app]);

  return {
    images,
  };
};
