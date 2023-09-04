import React from "react";
import { Container } from "@chakra-ui/react";
import { Gallery as ReactGallery } from "react-grid-gallery";
import { useStorage } from "@/utils/useStorage";

export const Gallery = () => {
  const { images } = useStorage();

  return (
    <Container id="gallery" marginTop={20}>
      <ReactGallery images={images} />
    </Container>
  );
};
