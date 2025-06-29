// script.js
import { PDFDocument } from "https://cdn.skypack.dev/pdf-lib";

const pdf1 = document.getElementById("pdf1");
const pdf2 = document.getElementById("pdf2");
const mergeBtn = document.getElementById("merge-btn");
const resetBtn = document.getElementById("reset-btn");
const downloadBtn = document.getElementById("download-btn");
const finalPdfMessage = document.getElementById("final-pdf");

let mergedBlobUrl = null;

window.mergePDF = async function () {
  const file1 = pdf1.files[0];
  const file2 = pdf2.files[0];

  if (!file1 || !file2) {
    alert("Please upload both PDF files.");
    return;
  }

  try {
    const [bytes1, bytes2] = await Promise.all([
      file1.arrayBuffer(),
      file2.arrayBuffer(),
    ]);

    const pdfDoc = await PDFDocument.create();

    const pdfA = await PDFDocument.load(bytes1);
    const pdfB = await PDFDocument.load(bytes2);

    const pagesA = await pdfDoc.copyPages(pdfA, pdfA.getPageIndices());
    pagesA.forEach((page) => pdfDoc.addPage(page));

    const pagesB = await pdfDoc.copyPages(pdfB, pdfB.getPageIndices());
    pagesB.forEach((page) => pdfDoc.addPage(page));

    const mergedPdfBytes = await pdfDoc.save();
    const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });

    // Cleanup previous URL
    if (mergedBlobUrl) URL.revokeObjectURL(mergedBlobUrl);

    mergedBlobUrl = URL.createObjectURL(blob);

    downloadBtn.onclick = () => {
      const a = document.createElement("a");
      a.href = mergedBlobUrl;
      a.download = "merged.pdf";
      a.click();
    };

    finalPdfMessage.querySelector("#download-btn").style.display = "inline-block";
    finalPdfMessage.classList.add("text-success");
    finalPdfMessage.classList.remove("text-danger");
  } catch (error) {
    console.error("PDF merge error:", error);
    alert("Something went wrong while merging PDFs.");
  }
};

resetBtn.addEventListener("click", () => {
  pdf1.value = "";
  pdf2.value = "";
  finalPdfMessage.classList.remove("text-success");
  finalPdfMessage.classList.remove("text-danger");
  finalPdfMessage.querySelector("#download-btn").style.display = "none";
  if (mergedBlobUrl) URL.revokeObjectURL(mergedBlobUrl);
});
