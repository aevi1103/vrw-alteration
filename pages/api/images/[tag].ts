import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const tag = req.query.tag;

      const url = `${process.env.CLOUDINARY_URL}/${process.env.CLOUDINARY_NAME}/resources/image/tags/${tag}`;

      // Encode the username and password in base64
      const username = process.env.CLOUDINARY_KEY;
      const password = process.env.CLOUDINARY_API_SECRET;
      const base64Credentials = btoa(`${username}:${password}`);

      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Basic ${base64Credentials}`);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
      };

      const response = await fetch(url, requestOptions);
      const data = await response.json();

      const resources = data.resources
        .map((img: any, i: number) => {
          const { url, width, height } = img;

          return {
            src: url,
            width: width,
            height: height,
          };
        }, [])
        .sort((a: any, b: any) => a.height - b.height);

      res.status(200).json(resources);
    } catch (error: any) {
      console.error(error);
      res.status(500).json(error.message);
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
