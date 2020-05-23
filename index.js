'use strict';

const fs = require('fs');

const output = './public';

deleteFolderRecursive(`${output}`);

createCatalog('company_categories');
createCatalog('document_types');
createCatalog('sectors');

generateLocationCatalogs();


function createCatalog(name) {
  const fileData = JSON.parse(fs.readFileSync(`./data/${name}.json`));
  const data = [];
  fileData.forEach(item => data.push(JSON.stringify(item)))
  createFolderRecursive(`${output}/${name}`);
  fs.writeFileSync(`${output}/${name}/index.html`, `[${data}]`);

}


function generateLocationCatalogs() {
  const citiesData = JSON.parse(fs.readFileSync('./data/cities.json'));
  const tax_officesData = JSON.parse(fs.readFileSync('./data/tax_offices.json'));

  const townsData = JSON.parse(fs.readFileSync('./data/towns.json'));

  const districtsData = JSON.parse(fs.readFileSync('./data/districts.json'));
  const neighborhoodsData = JSON.parse(fs.readFileSync('./data/neighborhoods.json'));
  // console.log(cities);
  const cities = [];
  citiesData.forEach(cityItem => {
    const cityStr = JSON.stringify({ id: cityItem.id, name: cityItem.name, plate_number: cityItem.plate_number });
    cities.push(cityStr);
    const cityFolder = `${output}/cities/${cityItem.id}`;
    createFolderRecursive(cityFolder);
    fs.writeFileSync(`${cityFolder}/index.html`, cityStr);

    createFolderRecursive(`${cityFolder}/tax_offices`);
    const tax_offices = [];
    tax_officesData.filter(t => t.city_id == cityItem.id).forEach(async (tax_officeItem) => {
      const tax_officeStr = JSON.stringify({ id: tax_officeItem.id, name: tax_officeItem.name, code: tax_officeItem.code, city_id: tax_officeItem.city_id });
      tax_offices.push(tax_officeStr);
      const tax_officeFolder = `${cityFolder}/tax_offices/${tax_officeItem.id}`;
      createFolderRecursive(tax_officeFolder);
      fs.writeFileSync(`${tax_officeFolder}/index.html`, tax_officeStr);

    });
    fs.writeFileSync(`${cityFolder}/tax_offices/index.html`, `[${tax_offices}]`);

    createFolderRecursive(`${cityFolder}/towns`);
    const towns = [];
    townsData.filter(t => t.city_id == cityItem.id).forEach(async (townItem) => {
      const townStr = JSON.stringify({ id: townItem.id, name: townItem.name, city_id: townItem.city_id });
      towns.push(townStr);
      const townFolder = `${cityFolder}/towns/${townItem.id}`;
      createFolderRecursive(townFolder);
      fs.writeFileSync(`${townFolder}/index.html`, townStr);



      createFolderRecursive(`${townFolder}/districts`);
      const districts = [];
      districtsData.filter(t => t.town_id == townItem.id).forEach(async (districtItem) => {
        const districtStr = JSON.stringify({ id: districtItem.id, name: districtItem.name, town_id: districtItem.town_id });
        districts.push(districtStr);
        const districtFolder = `${townFolder}/districts/${districtItem.id}`;
        createFolderRecursive(districtFolder);
        fs.writeFileSync(`${districtFolder}/index.html`, districtStr);

        createFolderRecursive(`${districtFolder}/neighborhoods`);


        const neighborhoods = [];
        neighborhoodsData.filter(t => t.district_id == districtItem.id).forEach(async (neighborhoodItem) => {
          const neighborhoodStr = JSON.stringify({ id: neighborhoodItem.id, name: neighborhoodItem.name, postal_code: neighborhoodItem.postal_code, district_id: neighborhoodItem.district_id });
          neighborhoods.push(neighborhoodStr);
          const neighborhoodFolder = `${districtFolder}/neighborhoods/${neighborhoodItem.id}`;
          createFolderRecursive(neighborhoodFolder);
          fs.writeFileSync(`${neighborhoodFolder}/index.html`, neighborhoodStr);
        });
        fs.writeFileSync(`${districtFolder}/neighborhoods/index.html`, `[${neighborhoods}]`);


      });
      fs.writeFileSync(`${townFolder}/districts/index.html`, `[${districts}]`);


    });
    fs.writeFileSync(`${cityFolder}/towns/index.html`, `[${towns}]`);

  });
  fs.writeFileSync(`${output}/cities/index.html`, `[${cities}]`);
}

function createFolderRecursive(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true })
  }
}
function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};
