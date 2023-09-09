import React from "react";
import { Box, Heading } from "@chakra-ui/react";
import { Gallery as ReactGallery } from "react-grid-gallery";
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

  if (error) return <div>failed to load</div>;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const smallItemStyles: React.CSSProperties = {
    cursor: "pointer",
    objectFit: "cover",
    width: "100%",
    maxHeight: "100%",
  };

  return (
    <Box margin={2} borderRadius={5} marginY={10}>
      <Heading size={"md"} marginBottom={5} fontWeight={"semibold"}>
        {title}
      </Heading>

      {/* <ReactGallery
        images={images}
        enableImageSelection={false}
        margin={2}
        rowHeight={233}
      /> */}

      <PhotoGallery>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            // gridTemplateRows: "114px 114px",
            gridGap: 2,
          }}
        >
          {images
            // .sort((a: any, b: any) => (b.height = a.height))
            .map((i: any, key: number) => (
              <Item
                key={key}
                original={i.src}
                thumbnail={i.src}
                width={i.width}
                height={i.height}
                alt="Image"
              >
                {({ ref, open }) => (
                  <Image
                    style={{ cursor: "pointer", objectFit: "contain" }}
                    src={i.src}
                    ref={ref as React.MutableRefObject<HTMLImageElement>}
                    onClick={open}
                    alt="img"
                    width={i.width}
                    height={i.height}
                    // fill
                  />
                )}
              </Item>
            ))}
        </Box>
      </PhotoGallery>
    </Box>
  );
};
