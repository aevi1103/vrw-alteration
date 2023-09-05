import React from "react";
import { Box } from "@chakra-ui/react";
import { Gallery as ReactGallery } from "react-grid-gallery";
import { useStorage } from "@/lib/utils/useStorage";

export const Gallery = () => {
  const { images } = useStorage();

  return (
    <Box id="gallery" margin={5} marginY={20}>
      <ReactGallery images={images} />
    </Box>
  );
};
