import { handleFiles, updateFileList, allData } from './restock/restock-file-handling.js';
import { displayData, downloadCSV } from './restock/restock-data-display.js';
import { processListings, processFBA, processBusiness, mergeData } from './restock/restock-data-processing.js';

const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");

dropzone.addEventListener("click", () => fileInput.click());

dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropzone.classList.add("dragover");
});

dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));

dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropzone.classList.remove("dragover");
  handleFiles(e.dataTransfer.files);
  updateFileList(e.dataTransfer.files);
});

fileInput.addEventListener("change", (e) => {
  handleFiles(e.target.files);
  updateFileList(e.target.files);
});
