import { cities, photoIntro } from "@/content/photos";
import PhotoBands from "./PhotoBands";

/**
 * Server side of the photo section: it reads the list of bands and hands the
 * visible ones to the client. What is switched off in content/photos.ts
 * (`hidden: true`) is neither rendered nor shipped in the JavaScript.
 */
export default function Photo() {
  return <PhotoBands cities={cities} intro={photoIntro} />;
}
