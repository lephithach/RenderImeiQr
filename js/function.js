const getFile = document.querySelector("#file");
const resultEl = document.querySelector(".result");

const processCvs = (data) => {
  const rows = data.split("\n");
  let header = rows[0].split(",");

  // Set new header
  let newHeader = [];
  header.forEach((header) => {
    let ps = header.replace(/\r/g, "");

    newHeader.push(ps);
  });

  header = newHeader;

  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i].split(",");

    if (row.length === header.length) {
      const obj = {};

      for (let j = 0; j < header.length; j++) {
        obj[header[j]] = row[j];
      }

      result.push(obj);
    }
  }

  return result;
};

const checkExtension = (file) => {
  let reader = new FileReader();
  let getNameFile = file[0].name;
  let getNameArray = getNameFile.split(".");

  for (let i = 1; i <= getNameArray.length; i++) {
    // Loop array name split
    if (i < getNameArray.length) {
      let fileExtension = getNameArray[i];

      // check match extension csv
      if (fileExtension != "csv") {
        alert("File này không được hỗ trợ, vui lòng chọn file CSV");
      } else {
        // Set up the reader to read the file as text
        reader.readAsText(file[0]);

        // Set up a callback function to be called when the file has been read
        reader.onload = () => {
          // Access the file contents as a string
          const fileContents = reader.result;
          let result = processCvs(fileContents);

          // Render HTML
          let html = "";

          result.forEach((item) => {
            // console.log(item.TEN);
            html += `
        <div class="item">
            <img src="https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=${item.IMEI}">
            <p class="name-product">${item.TEN}</p>
        </div>
        `;

            resultEl.innerHTML = html;
          });
        };
      }
    }
  }
};

getFile.addEventListener("change", (e) => {
  let file = getFile.files;
  checkExtension(file);
});

// fetch("../data/chitiettontheoIMEI.csv")
//   .then((response) => response.text())
//   .then((data) => {
//     const rows = data.split("\n");
//     let header = rows[0].split(",");

//     // Set new header
//     let newHeader = [];
//     header.forEach((header) => {
//       let ps = header.replace(/\r/g, "");

//       newHeader.push(ps);
//     });

//     header = newHeader;

//     const result = [];

//     for (let i = 1; i < rows.length; i++) {
//       const row = rows[i].split(",");

//       if (row.length === header.length) {
//         const obj = {};

//         for (let j = 0; j < header.length; j++) {
//           obj[header[j]] = row[j];
//         }

//         result.push(obj);
//       }
//     }

//     console.log(result);

//     let html = "";

//     result.forEach((item) => {
//       // console.log(item.TEN);
//       html += `
//         <div class="item">
//             <img src="https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=${item.IMEI}">
//             <p class="name-product">${item.TEN}</p>
//         </div>
//         `;

//       resultEl.innerHTML = html;
//     });
//   })
//   .catch((error) => console.error(error));
