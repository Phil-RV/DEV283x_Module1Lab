
// csv2json.js
// convert csv file to json format

// read the input file
// using the 1st line of the csv file to get the property names
// for every other line in the file,
// use the values to create a new json object

const fs = require('fs');
const path = require('path');

//const split = require('strman.split');

const csvFileNameDefault = path.join( __dirname, 'customer-data.csv');
const jsonFileNameDefault = path.join( __dirname, 'customer-data-converted.json');

const convertCsv2Json = (csvFile = csvFileNameDefault, jsonFile = jsonFileNameDefault) => {
    // read the file
    // first create file reader
    var lineReader = require('readline').createInterface({
        input: require('fs').createReadStream(csvFile)
    });

    var jsonProperties = [];

    // create an object array to hold the csv data converted to json objects
    var objArray=[];

    const firstInputLineHandler = (inputData) =>{
        //console.log(`FIRST input line ${inputData}`);

        // convert the input to a list/array of property names
        //lineReader.on(firstInputLineHandler);
        jsonProperties = inputData.split(",");

        //console.log(`Property count: ${jsonProperties.length}`);

        // and set the handler for subsequent lines of data
        lineReader.on('line', subsequentInputLineHandler);
    }

    const subsequentInputLineHandler = (inputData) => {
        // get the property values
        var propertyValues = inputData.split(",");

        // put together the json property names and property values
        // to create a json object
        // which can then be serialised
        var obj = BuildObject(jsonProperties, propertyValues);

        objArray.push(obj);

        //console.log(`NOT FIRST input line ${inputData}`);
        //console.log(` ==> ${JSON.stringify(obj)}`);

        // still needs a change to comma separate the json objects
        //objectWriter.write(JSON.stringify(obj));
    }

    function BuildObject(properties, values)
    {
        var newobj = {};

        for (var i = 0; i < properties.length; i++)
        {
            newobj[properties[i]] = values[i];
        }

        return newobj;

    }

    // now create handlers for emitted events
    lineReader.once('line', firstInputLineHandler ) ;
    //function (csvDataLine) {
        //console.log('Line from file:', csvDataLine);
    //});

    // handle the end of file
    // closing the input file and writing the objects to the output file
    // note using alternative method of specifying handler function (from above)
    lineReader.on('close', () => {
        //console.log('End of File reached');

        // create file writer and write out the object array
        var objectWriter = require('fs').createWriteStream(jsonFile);

        // 2 spaces in string below are indent
        // could be replaced by "\t" to indent by a tab
        objectWriter.write(JSON.stringify(objArray, null, "  "));
        objectWriter.close();
    })

};


convertCsv2Json(process.argv[2] , process.argv[3]);
