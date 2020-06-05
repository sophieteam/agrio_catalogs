'use strict';

const fs = require('fs');

const output = './public';

deleteFolderRecursive(`${output}/*`);

createCatalog('company_categories');
createCatalog('document_types');
createCatalog('sectors');

generateCitiesDistrictsTaxOfficesCatalogs();
generateDistrictsTownsCatalogs();
generateTownsNeighborhoodsCatalogs();

function createCatalog(name) {
  const fileData = JSON.parse(fs.readFileSync(`./data/${name}.json`));
  const data = [];
  fileData.forEach(item => data.push(JSON.stringify(item)))
  createFolderRecursive(`${output}/${name}`);
  fs.writeFileSync(`${output}/${name}/index.html`, `[${data}]`);

}


function generateCitiesDistrictsTaxOfficesCatalogs() {
  const citiesData = JSON.parse(fs.readFileSync('./data/cities.json'));
  const tax_officesData = JSON.parse(fs.readFileSync('./data/tax_offices.json'));


  const districtsData = JSON.parse(fs.readFileSync('./data/districts.json'));
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
    });
    fs.writeFileSync(`${cityFolder}/tax_offices/index.html`, `[${tax_offices}]`);

    createFolderRecursive(`${cityFolder}/districts`);
    const districts = [];
    districtsData.filter(t => t.city_id == cityItem.id).forEach(async (districtItem) => {
      const districtStr = JSON.stringify({ id: districtItem.id, name: districtItem.name, city_id: districtItem.city_id });
      districts.push(districtStr);
    });
    fs.writeFileSync(`${cityFolder}/districts/index.html`, `[${districts}]`);
  });
  fs.writeFileSync(`${output}/cities/index.html`, `[${cities}]`);
}

function generateDistrictsTownsCatalogs() {
  const districtsData = JSON.parse(fs.readFileSync('./data/districts.json'));
  const townsData = JSON.parse(fs.readFileSync('./data/towns.json'));

  // console.log(cities);
  const districts = [];
  districtsData.forEach(districtItem => {
    const districtStr = JSON.stringify({ id: districtItem.id, name: districtItem.name, city_id: districtItem.city_id });
    const districtFolder = `${output}/districts/${districtItem.id}`;
    createFolderRecursive(districtFolder);
    fs.writeFileSync(`${districtFolder}/index.html`, districtStr);

    createFolderRecursive(`${districtFolder}/towns`);
    const towns = [];
    townsData.filter(t => t.district_id == districtItem.id).forEach(async (townItem) => {
      const townsStr = JSON.stringify({ id: townItem.id, name: townItem.name, district_id: townItem.district_id });
      towns.push(townsStr);
    });
    fs.writeFileSync(`${districtFolder}/towns/index.html`, `[${towns}]`);
  });
}

function generateTownsNeighborhoodsCatalogs() {
  const townsData = JSON.parse(fs.readFileSync('./data/towns.json'));
  const neighborhoodsData = JSON.parse(fs.readFileSync('./data/neighborhoods.json'));

  // console.log(cities);
  const towns = [];
  townsData.forEach(townItem => {
    const townStr = JSON.stringify({ id: townItem.id, name: townItem.name, district_id: townItem.district_id });
    const townFolder = `${output}/towns/${townItem.id}`;
    createFolderRecursive(townFolder);
    fs.writeFileSync(`${townFolder}/index.html`, townStr);

    createFolderRecursive(`${townFolder}/neighborhoods`);
    const neighborhoods = [];
    neighborhoodsData.filter(t => t.town_id == townItem.id).forEach(async (neighborhoodItem) => {
      const neighborhoodsStr = JSON.stringify({ id: neighborhoodItem.id, name: neighborhoodItem.name, town_id: neighborhoodItem.town_id });
      neighborhoods.push(neighborhoodsStr);
    });
    fs.writeFileSync(`${townFolder}/neighborhoods/index.html`, `[${neighborhoods}]`);
  });
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
