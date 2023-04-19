// COMP308-402 Group Project-Group-4
// Authors:     Marcus Ngooi (301147411)
//              Ikamjot Hundal (301134374)
//              Ben Coombes (301136902)
//              Grant Macmillan (301129935)
//              Gabriel Dias Tinoco
//              Tatsiana Ptushko (301182173)
// Description: AI Schema.

const { GraphQLObjectType } = require("graphql");
const GraphQLList = require("graphql").GraphQLList;
const GraphQLString = require("graphql").GraphQLString;
const GraphQLFloat = require("graphql").GraphQLFloat;
// const GraphQLInt = require("graphql").GraphQLInt;
const GraphQLNonNull = require("graphql").GraphQLNonNull;

const resultsType = new GraphQLObjectType({
  name: "results",
  fields: function () {
    return {
      resultsArray: {
        type: GraphQLList(GraphQLFloat),
      },
    };
  },
});

const queryType = {
  hepatitisStatus: {
    type: resultsType,
    // type: GraphQLList(GraphQLFloat),
    args: {
      age: {
        type: new GraphQLNonNull(GraphQLString),
      },
      sex: {
        type: new GraphQLNonNull(GraphQLString),
      },
      steroid: {
        type: new GraphQLNonNull(GraphQLString),
      },
      antivirals: {
        type: new GraphQLNonNull(GraphQLString),
      },
      fatigue: {
        type: new GraphQLNonNull(GraphQLString),
      },
      malaise: {
        type: new GraphQLNonNull(GraphQLString),
      },
      anorexia: {
        type: new GraphQLNonNull(GraphQLString),
      },
      liverBig: {
        type: new GraphQLNonNull(GraphQLString),
      },
      liverFirm: {
        type: new GraphQLNonNull(GraphQLString),
      },
      spleenPalpable: {
        type: new GraphQLNonNull(GraphQLString),
      },
      spiders: {
        type: new GraphQLNonNull(GraphQLString),
      },
      ascites: {
        type: new GraphQLNonNull(GraphQLString),
      },
      varices: {
        type: new GraphQLNonNull(GraphQLString),
      },
      bilurubin: {
        type: new GraphQLNonNull(GraphQLString),
      },
      alkPhosphate: {
        type: new GraphQLNonNull(GraphQLString),
      },
      sGot: {
        type: new GraphQLNonNull(GraphQLString),
      },
      albumin: {
        type: new GraphQLNonNull(GraphQLString),
      },
      protime: {
        type: new GraphQLNonNull(GraphQLString),
      },
      histology: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (root, params, context) => {
      const tf = require("@tensorflow/tfjs");
      require("@tensorflow/tfjs-node");
      const path = require("path");
      const modelPath = path.join(__dirname, "../model.json");
      const model = await tf
        .loadLayersModel(`file://${modelPath}`)
        .catch((err) => console.log(err));
      const inputData = tf.tensor2d([
        [
          parseInt(params.age),
          parseInt(params.sex),
          parseInt(params.steroid),
          parseInt(params.antivirals),
          parseInt(params.fatigue),
          parseInt(params.malaise),
          parseInt(params.anorexia),
          parseInt(params.liverBig),
          parseInt(params.liverFirm),
          parseInt(params.spleenPalpable),
          parseInt(params.spiders),
          parseInt(params.ascites),
          parseInt(params.varices),
          parseFloat(params.bilurubin),
          parseInt(params.alkPhosphate),
          parseInt(params.sGot),
          parseFloat(params.albumin),
          parseInt(params.protime),
          parseInt(params.histology),
        ],
      ]);
      console.log(
        parseInt(params.age),
        parseInt(params.sex),
        parseInt(params.steroid),
        parseInt(params.antivirals),
        parseInt(params.fatigue),
        parseInt(params.malaise),
        parseInt(params.anorexia),
        parseInt(params.liverBig),
        parseInt(params.liverFirm),
        parseInt(params.spleenPalpable),
        parseInt(params.spiders),
        parseInt(params.ascites),
        parseInt(params.varices),
        parseFloat(params.bilurubin),
        parseInt(params.alkPhosphate),
        parseInt(params.sGot),
        parseFloat(params.albumin),
        parseInt(params.protime),
        parseInt(params.histology)
      );
      const results = model.predict(inputData);
      results.print();
      const resultsArray = await results.array();
      console.log(resultsArray);
      var resultForData1 = resultsArray[0];
      const dataToSend = {
        resultsArray: resultForData1,
      };
      console.log(dataToSend);
      return dataToSend;
    },
  },
};

module.exports = {
  aiQuery: queryType,
};
