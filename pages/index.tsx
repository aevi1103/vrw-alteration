import {
  GridItem,
  Container,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
} from "@chakra-ui/react";
import { AppMenu, Services, Gallery, About, ContactForm } from "@/components";
import React from "react";
import { supabase } from "@/lib/supabase-client";
import { DbResult } from "@/database.types";
import { AnimatedComponent, Header, Layout } from "@/components";
import { AboutRecord } from "@/lib/types/about";
import { useMenuHeaderStore } from "@/store/useMenuHeaderStore";

export default function Home({
  prices,
  about,
}: {
  prices: any;
  about: AboutRecord[];
}) {
  const { isMenuOpen, toggleMenu } = useMenuHeaderStore();

  return (
    <>
      <Layout>
        <Header />

        <GridItem colSpan={4} id="services">
          <Container>
            <AnimatedComponent animatedName="fadeInLeft">
              <Services prices={prices} />
            </AnimatedComponent>
          </Container>
        </GridItem>

        <GridItem colSpan={4} id="gallery">
          <AnimatedComponent animatedName="fadeInRight">
            <Container>
              <Gallery tag="machine" title="Machine" />
              <Gallery tag="alterations" title="Alterations" />
              <Gallery tag="workspace" title="Workspace" />
            </Container>
          </AnimatedComponent>
        </GridItem>

        <GridItem colSpan={4} id="about">
          <Container>
            <About data={about} />
          </Container>
        </GridItem>

        <GridItem colSpan={4} id="contact">
          <Container>
            <ContactForm />
          </Container>
        </GridItem>
      </Layout>
      <Drawer
        isOpen={isMenuOpen}
        placement="right"
        onClose={toggleMenu}
        size={"xs"}
      >
        <DrawerOverlay />
        <DrawerContent backgroundColor={"brand.primary"}>
          <DrawerCloseButton />
          <DrawerHeader />
          <DrawerBody>
            <AppMenu isVertical onClose={toggleMenu} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export async function getServerSideProps() {
  const prices = await getPrices();
  const about = await getAbout();
  return {
    props: {
      prices,
      about,
    },
  };
}

async function getPrices() {
  const query = supabase
    .from("categories")
    .select("*, prices(id, price, service))");

  const prices: DbResult<typeof query> = await query;
  return prices.data;
}

async function getAbout() {
  const query = supabase.from("about").select("*");
  const about: DbResult<typeof query> = await query;
  return about.data;
}
