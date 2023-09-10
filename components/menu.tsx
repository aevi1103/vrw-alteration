import { Grid, GridItem, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useAuth } from "@/lib/utils/useAuth";

const LinkWrapper = ({ children }: { children: React.ReactNode }) => (
  <GridItem
    placeSelf={"center"}
    fontWeight="semibold"
    position={"relative"}
    cursor={"pointer"}
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

  const scrollToSection = (targetId: string) => {
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const offset = 200; // Adjust this to match your header's height
      window.scrollTo({
        top: targetElement.offsetTop - offset,
        behavior: "smooth",
      });
    }
  };

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
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
        <Text onClick={() => scrollToSection("services")}>Services</Text>
      </LinkWrapper>
      <LinkWrapper>
        <Text onClick={() => scrollToSection("gallery")}>Gallery</Text>
      </LinkWrapper>
      <LinkWrapper>
        <Text onClick={() => scrollToSection("about")}>About</Text>
      </LinkWrapper>
      <LinkWrapper>
        <Text onClick={() => scrollToSection("contact")}>Contact</Text>
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
