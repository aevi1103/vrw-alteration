import React, { useEffect } from "react";
import { Heading, Box, Container } from "@chakra-ui/react";
import { Gallery as ReactGallery } from "react-grid-gallery";

const fetchImages = async () => {
  const data = await fetch("https://picsum.photos/v2/list");
  const imgs = await data.json();
  return imgs.map((img: any) => ({
    src: img.download_url,
    width: img.width,
    height: img.height,
    caption: img.author,
  }));
};

export const Gallery = () => {
  const [images, setImages] = React.useState([]);

  useEffect(() => {
    (async () => {
      const images = await fetchImages();
      setImages(images);
    })();
  }, []);

  return (
    <Container id="gallery">
      <ReactGallery images={images} />
    </Container>
  );
};
