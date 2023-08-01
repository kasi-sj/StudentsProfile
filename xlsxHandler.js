const xlsx = require("xlsx");
function xlsxHandler(req){
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    return data;
}
module.exports = {
  xlsxHandler : xlsxHandler
}