const fileList = document.getElementById("fileList");
const loadingIndicator = document.getElementById("loading");
const progressBar = document.getElementById("progress-bar");
const loadingStatus = document.getElementById("loading-status");
let allData = { listings: [], fba: [], business: [] };

function updateFileList(files) {
  fileList.innerHTML = "";
  const fileArray = Array.from(files);
  if (fileArray.length === 0) {
    fileList.textContent = "No files uploaded.";
    return;
  }

  const fileTypes = {
    listings: { name: 'Listings CSV', accepted: false },
    fba: { name: 'FBA Inventory CSV', accepted: false },
    business: { name: 'Business Report CSV', accepted: false }
  };

  fileArray.forEach(file => {
    const fileName = file.name.toLowerCase();
    let fileType = 'unknown';
    if (fileName.match(/all\\s*listings?.*\\.csv$/i)) {
      fileType = 'listings';
    } else if (fileName.match(/fba.*inventory?.*\\.csv$/i) || fileName.match(/inventory\\s*report.*\\.csv$/i) || fileName.match(/ir.*\\.csv$/i) || fileName.match(/invreport.*\\.csv$/i) || fileName.match(/managefba.*\\.csv$/i) || fileName.match(/manage\\s*fba.*\\.csv$/i) || fileName.match(/mfba.*\\.csv$/i) || fileName.match(/fba.*\\.csv$/i)) {
      fileType = 'fba';
    } else if (fileName.match(/business.*report?.*\\.csv$/i) || fileName.match(/90days.*\\.csv$/i) || fileName.match(/90\\s*days.*\\.csv$/i) || fileName.match(/90d.*\\.csv$/i) || fileName.match(/90daystodate.*\\.csv$/i)) {
      fileType = 'business';
    }

    const listItem = document.createElement("div");
    listItem.textContent = `✅ ${file.name} (${fileTypes[fileType] ? fileTypes[fileType].name : 'Unknown File Type'})`;
    listItem.classList.add("file-item");
    fileList.appendChild(listItem);
  });
}

function handleFiles(files) {
  loadingIndicator.style.display = "block";
  let fileCount = files.length;
  let processedCount = 0;

  Array.from(files).forEach(file => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      const errorItem = document.createElement("div");
      errorItem.textContent = `❌ Invalid file type: ${file.name}. Please upload a CSV file.`;
      errorItem.classList.add("file-error");
      fileList.appendChild(errorItem);
      processedCount++;
      if (processedCount === fileCount) {
        loadingIndicator.style.display = "none";
      }
      return;
    }
    Papa.parse(file, {
      header: true,
      worker: true, // Parse in a worker thread
      encoding: 'utf-8', // Explicitly set encoding to UTF-8
      complete: (results) => {
        if (results.errors.length > 0) {
          if (!results) {
            console.error("CSV Parsing Error: Results are undefined");
            return;
          }
          console.error("CSV Parsing Error:", results.errors);
          const errorItem = document.createElement("div");
          errorItem.textContent = `❌ Error parsing ${file.name}: ${results.errors[0].message}`;
          errorItem.classList.add("file-error");
          fileList.appendChild(errorItem);
          processedCount++;
          if (processedCount === fileCount) {
            loadingIndicator.style.display = "none";
          }
          return;
        }
        const headers = results.meta.fields;
        let processedData;
        try {
          if (fileName.match(/all\\s*listings?.*\\.csv$/i)) {
            processedData = processListings(results.data);
            allData.listings = processedData;
          } else if (fileName.match(/fba\\s*inventory?.*\\.csv$/i) || fileName.match(/inventory\\s*report.*\\.csv$/i) || fileName.match(/ir.*\\.csv$/i) || fileName.match(/invreport.*\\.csv$/i) || fileName.match(/managefba.*\\.csv$/i) || fileName.match(/manage\\s*fba.*\\.csv$/i) || fileName.match(/mfba.*\\.csv$/i) || fileName.match(/fba.*\\.csv$/i)) {
            allData.fba = processFBA(results.data);
          } else if (fileName.match(/business\\s*report.*\\.csv$/i) || fileName.match(/90days.*\\.csv$/i) || fileName.match(/90\\s*days.*\\.csv$/i) || fileName.match(/90d.*\\.csv$/i) || fileName.match(/90daystodate.*\\.csv$/i)) {
            allData.business = processBusiness(results.data);
          }
        } catch (error) {
          console.error("Data Processing Error:", error);
          const errorItem = document.createElement("div");
          errorItem.textContent = `❌ Data Processing Error in ${file.name}: ${error.message}`;
          errorItem.classList.add("file-error");
          fileList.appendChild(errorItem);
          processedCount++;
          if (processedCount === fileCount) {
            loadingIndicator.style.display = "none";
          }
          return;
        }
        
        processedCount++;
        if (processedCount === fileCount) {
          loadingIndicator.style.display = "none";
          let mergedData = mergeData();
          displayData(mergedData);
          downloadCSV(mergedData);
        }
      }
    });
  });
  // Check if all three file types are uploaded
  if (allData.listings.length > 0 && allData.fba.length > 0 && allData.business.length > 0) {
    let mergedData = mergeData();
    displayData(mergedData);
    downloadCSV(mergedData);
  } else {
    const errorItem = document.createElement("div");
    errorItem.textContent = "❌ Please upload all three CSV files (Listings, FBA, and Business).";
    errorItem.classList.add("file-error");
    fileList.appendChild(errorItem);
    loadingIndicator.style.display = "none";
  }
}

export { handleFiles, updateFileList, allData };