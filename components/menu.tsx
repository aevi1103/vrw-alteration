import { Grid, GridItem } from "@chakra-ui/react";
import Link from "next/link";
import { useAuth } from "@/lib/utils/useAuth";

const LinkWrapper = ({ children }: { children: React.ReactNode }) => (
  <GridItem
    placeSelf={"center"}
    fontWeight="normal"
    position={"relative"}
    _hover={{
      // fontWeight: "semibold",
      transform: "scale(1.1)",
      "::after": {
        content: "''",
        position: "absolute",
        bottom: "0",
        left: "0",
        width: "100%",
        height: "2px",
        backgroundColor: "black",
      },
    }}
    transition="all 0.5s ease"
  >
    {children}
  </GridItem>
);

export function AppMenu({ isVertical }: { isVertical?: boolean }) {
  const { user, signIn, auth } = useAuth();

  return (
    <Grid
      gridTemplateColumns={isVertical ? "1fr" : "repeat(6, minmax(0, 1fr))"}
      marginBottom={3}
      gap={isVertical ? 5 : 0}
      marginTop={isVertical ? 10 : 0}
    >
      <LinkWrapper>
        <Link href={"/"}>Home</Link>
      </LinkWrapper>

      <LinkWrapper>
        <Link
          href={{
            hash: "#services",
          }}
        >
          Services
        </Link>
      </LinkWrapper>
      <LinkWrapper>
        <Link
          href={{
            hash: "#gallery",
          }}
        >
          Gallery
        </Link>
      </LinkWrapper>
      <LinkWrapper>
        <Link
          href={{
            hash: "#about",
          }}
        >
          About
        </Link>
      </LinkWrapper>
      <LinkWrapper>
        <Link
          href={{
            hash: "#contact",
          }}
        >
          Contact
        </Link>
      </LinkWrapper>
      {user !== undefined && (
        <LinkWrapper>
          <Link
            href={"/"}
            onClick={() => {
              if (user) {
                auth.signOut();
              } else {
                signIn();
              }
            }}
          >
            {user ? "Logout" : "Login"}
          </Link>
        </LinkWrapper>
      )}
    </Grid>
  );
}
