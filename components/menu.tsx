import { Grid, GridItem } from "@chakra-ui/react";
import Link from "next/link";
import { useAuth } from "@/lib/utils/useAuth";

const LinkWrapper = ({ children }: { children: React.ReactNode }) => (
  <GridItem
    placeSelf={"center"}
    fontWeight="semibold"
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

export function AppMenu({
  isVertical,
  onClose,
}: {
  isVertical?: boolean;
  onClose?: () => void;
}) {
  const { user, signIn, auth } = useAuth();

  const onClick = () => {
    if (onClose && isVertical) {
      onClose();
    }
  };

  return (
    <Grid
      gridTemplateColumns={isVertical ? "1fr" : "repeat(6, minmax(0, 1fr))"}
      marginBottom={3}
      gap={isVertical ? 5 : 0}
      marginTop={isVertical ? 10 : 0}
    >
      <LinkWrapper>
        <Link href={"/"} onClick={onClick}>
          Home
        </Link>
      </LinkWrapper>

      <LinkWrapper>
        <Link
          href={{
            hash: "#services",
          }}
          onClick={onClick}
        >
          Services
        </Link>
      </LinkWrapper>
      <LinkWrapper>
        <Link
          href={{
            hash: "#gallery",
          }}
          onClick={onClick}
        >
          Gallery
        </Link>
      </LinkWrapper>
      <LinkWrapper>
        <Link
          href={{
            hash: "#about",
          }}
          onClick={onClick}
        >
          About
        </Link>
      </LinkWrapper>
      <LinkWrapper>
        <Link
          href={{
            hash: "#contact",
          }}
          onClick={onClick}
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
