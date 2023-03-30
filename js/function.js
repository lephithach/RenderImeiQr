const getFile = document.querySelector("#file");
const resultEl = document.querySelector(".result");
const typeEl = document.querySelector("#type");
const btnOk = document.querySelector("#btnOk");

function removeVietnameseTones(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g, " ");
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    " "
  );
  return str;
}

const ucwords = (str) => {
  let strArrTemp = [];

  str = str.split(" ");

  str.forEach((strNew) => {
    let strTemp = "";

    for (let i = 0; i < strNew.length; i++) {
      if (i == 0) {
        strTemp += strNew[i].toUpperCase();
      } else {
        strTemp += strNew[i].toLowerCase();
      }
    }

    strArrTemp.push(strTemp);
  });

  return strArrTemp.join("");
};

const processCvs = (data) => {
  const rows = data.split("\n");
  let header = rows[0].split(",");

  // Set new header
  let newHeader = [];
  header.forEach((header) => {
    let ps = header.replace(/\r/g, "");

    // Convert String Vietnamese
    ps = removeVietnameseTones(ps);

    // Remove whitespace
    ps = ucwords(ps);

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

const qrcode = (file) => {
  const { err, message } = checkExtension(file);

  if (err == false) {
    let reader = new FileReader();

    reader.readAsText(file[0]);

    // Set up a callback function to be called when the file has been read
    reader.onload = () => {
      // Access the file contents as a string
      const fileContents = reader.result;
      let result = processCvs(fileContents);

      // Render HTML
      let html = "";

      result.forEach((item) => {
        html += `
            <div class="item">
                <img src="https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=${item.Imei}">
                <p class="name-product">${item.TenHang}</p>
            </div>
          `;
      });

      resultEl.innerHTML = html;
    };
  } else {
    // Show alert
    alert(message);
  }
};

const checkExtension = (file) => {
  let err = false;
  let getNameFile = file[0].name;
  let getNameArray = getNameFile.split(".");

  for (let i = 1; i <= getNameArray.length; i++) {
    // Loop array name split
    if (i < getNameArray.length) {
      let fileExtension = getNameArray[i];

      // check match extension csv
      if (fileExtension != "csv") {
        err = true;

        return {
          err,
          message: "File này không được hỗ trợ, vui lòng chọn file CSV",
        };
        // alert("File này không được hỗ trợ, vui lòng chọn file CSV");
      }
    }
  }

  return { err, message: "ok" };
};

const barcode = (file) => {
  const { err, message } = checkExtension(file);

  if (err == false) {
    let reader = new FileReader();

    reader.readAsText(file[0]);

    // Set up a callback function to be called when the file has been read
    reader.onload = () => {
      // Access the file contents as a string
      const fileContents = reader.result;
      let result = processCvs(fileContents);

      // Render HTML
      let html = "";

      result.forEach((item) => {
        html += `
            <div class="barcode-item">
              <img src="https://bwipjs-api.metafloor.com/?bcid=code128&text=${item.Imei}&scale=2&rotate=N" />
              <p class="imei-product">${item.Imei}</p>
              <p class="name-product">${item.TenHang}</p>
            </div>
          `;
      });

      resultEl.innerHTML = html;
    };
  } else {
    // Show alert
    alert(message);
  }
};

btnOk.addEventListener("click", (e) => {
  let file = getFile.files;

  resultEl.classList.remove("barcode");
  resultEl.classList.remove("qr");
  resultEl.classList.remove("in-tem");

  switch (typeEl.value) {
    case "qr":
      qrcode(file);
      break;

    case "barcode128":
      barcode(file);
      resultEl.classList.add("barcode");
      break;

    case "barcode128Tem":
      barcode(file);
      resultEl.classList.add("in-tem");
      break;

    default:
      break;
  }
});
