import React from "react";
import { Box, Heading } from "@chakra-ui/react";
import useSWR from "swr";
import { fetcher } from "@/lib/utils/fetcher";
import { Gallery as PhotoGallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import Image from "next/image";

export const Gallery = ({ tag, title }: { tag: string; title: string }) => {
  const {
    data: images,
    error,
    isLoading,
  } = useSWR(`/api/images/${tag}`, fetcher);

  if (error) return <div>failed to load images</div>;
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!images) {
    return null;
  }

  const imgSize = 160;
  const smallItemStyles: React.CSSProperties = {
    cursor: "pointer",
    objectFit: "cover",
    width: imgSize,
    height: imgSize,
  };

  return (
    <Box margin={2} borderRadius={5} marginY={10}>
      <Heading size={"md"} marginBottom={5} fontWeight={"semibold"}>
        {title}
      </Heading>

      <PhotoGallery>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridGap: 2,
          }}
        >
          {images?.map((i: any, key: number) => (
            <Item
              key={key}
              original={i.src}
              thumbnail={i.src}
              width={i.width}
              height={i.height}
              alt="Image"
              cropped
            >
              {({ ref, open }) => (
                <Image
                  style={smallItemStyles}
                  src={i.src}
                  ref={ref as React.MutableRefObject<HTMLImageElement>}
                  onClick={open}
                  alt="img"
                  width={imgSize}
                  height={imgSize}
                />
              )}
            </Item>
          ))}
        </Box>
      </PhotoGallery>
    </Box>
  );
};
