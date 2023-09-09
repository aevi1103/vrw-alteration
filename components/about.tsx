import { Box, Heading, Text } from "@chakra-ui/react";

const aboutData = {
  title: "About VRW Alterations",
  sections: [
    {
      heading: "Crafting Personalized Refinement",
      text: `At VRW Alterations, we specialize in the delicate art of enhancing your wardrobe to fit you flawlessly. Our skilled team of artisans is dedicated to understanding your unique preferences, ensuring that each alteration doesn't just fit your garments, but also fits your personality. From tapering suits to perfection, to adjusting gowns to capture your elegance, every stitch is a tribute to the seamless fusion of craftsmanship and your aspirations.`,
    },
    {
      heading: "Seamless Style, Redefined",
      text: `"Seamless style, tailored for you" is more than a motto – it's the core of what we do. We believe that well-fitted clothing is a canvas for your confidence. Our consultations delve into your style sensibilities, aiming to redefine your wardrobe into a true reflection of your identity. Our alterations are not just about the fit; they're about refining your fashion narrative.`,
    },
    {
      heading: "Precision with Purpose",
      text: `At VRW Alterations, precision is our promise. Every adjustment, every stitch is carried out with meticulous attention to detail. Yet, our commitment goes beyond aesthetics. We embrace ethical practices and sustainability, ensuring that your style choices align with your values.`,
    },
    {
      heading: "Step into the VRW Experience",
      text: `Join us in the world of VRW Alterations, where threads of precision intertwine with the stories of your style. Let's collaborate in perfecting fashion that's not just a statement, but a reflection of you. Your journey to refined style starts here.`,
    },
  ],
};

export const About = () => {
  return (
    <Box p={4}>
      <Heading as="h1" mb={4}>
        {aboutData.title}
      </Heading>
      {aboutData.sections.map((section, index) => (
        <Text key={index} mb={6}>
          <strong>{section.heading}</strong>
          <br />
          {section.text}
        </Text>
      ))}
    </Box>
  );
};
