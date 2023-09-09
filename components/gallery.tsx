import React from "react";
import { Box, Heading } from "@chakra-ui/react";
import { Gallery as ReactGallery } from "react-grid-gallery";
import useSWR from "swr";
import { fetcher } from "@/lib/utils/fetcher";

export const Gallery = ({ tag, title }: { tag: string; title: string }) => {
  const {
    data: images,
    error,
    isLoading,
  } = useSWR(`/api/images/${tag}`, fetcher);

  if (error) return <div>failed to load</div>;

  if (isLoading) {
    return <div>Loading...</div>;
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
