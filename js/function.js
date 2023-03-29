const resultEl = document.querySelector(".result");

fetch("../data/chitiettontheoIMEI.csv")
  .then((response) => response.text())
  .then((data) => {
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

    console.log(result);

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
  })
  .catch((error) => console.error(error));
