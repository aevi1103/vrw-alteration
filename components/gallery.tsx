import React, { useState } from "react";
import { Box, Heading } from "@chakra-ui/react";
import {
  Gallery as ReactGallery,
  ThumbnailImageProps,
} from "react-grid-gallery";
import { useStorage } from "@/lib/utils/useStorage";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export const Gallery = ({ path, title }: { path: string; title: string }) => {
  const { images } = useStorage({
    subPath: path,
  });

  if (images.length === 0) {
    return null;
  }

  return (
    <Box id="gallery" margin={2} borderRadius={5} marginY={10}>
      <Heading size={"md"} marginBottom={5} fontWeight={"semibold"}>
        {title}
      </Heading>

      <ReactGallery
        images={images}
        enableImageSelection={false}
        margin={5}
        rowHeight={233}

        // thumbnailStyle={{
        //   borderRadius: 5,
        // }}
      />
    </Box>
  );
};
