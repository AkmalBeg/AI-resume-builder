import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const pdftotext = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
    }).promise;

    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      fullText +=
        content.items
          .map((item) => item.str)
          .join(" ") + "\n";
    }

    console.log(fullText);

    return fullText;
  } catch (err) {
    console.error("PDF Error:", err);
    throw err;
  }
};

export default pdftotext;