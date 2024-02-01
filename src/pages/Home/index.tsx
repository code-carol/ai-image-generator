import "./Home.css";
import { FormEvent, ChangeEvent } from "../../types";
import { useState } from "react";

interface ImageData {
  url: string;
  // Include any other properties that might be part of the image data
}

const Home = () => {
  const apiKey = process.env.API_KEY;

  const [inputValue, setInputValue] = useState("");
  const [images, setImages] = useState<ImageData[]>([]);

  const onChangeValue = (e: ChangeEvent) => {
    setInputValue(e.target.value);
  };

  const getImage = async (e: FormEvent) => {
    e.preventDefault();
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "dall-e-2",
        prompt: inputValue,
        n: 4,
        size: "1024x1024",
      }),
    };

    try {
      const response = await fetch(
        "https://api.openai.com/v1/images/generations",
        options
      );
      const respData = await response.json();
      console.log(respData);
      if (respData && respData.data) {
        setImages(respData.data);
      } else {
        // Handle the case where the data is not in the expected format
        console.error("Invalid data format", respData);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <h1>Wall-e</h1>
      <form onSubmit={getImage}>
        <div>
          <input type="text" value={inputValue} onChange={onChangeValue} />
        </div>
        <button type="submit">Send</button>
      </form>
      <section>
        {images.map((img: ImageData, index: number) => (
          <img
            key={index}
            src={img["url"]}
            alt={`AI Image generated of ${inputValue}`}
          />
        ))}
      </section>
    </>
  );
};

export default Home;
