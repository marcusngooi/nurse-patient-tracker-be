// COMP308-402 Group Project
// Authors:     Marcus Ngooi (301147411)
//              Ikamjot Hundal (301134374)
//              Ben Coombes
//              Grant Macmillan
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
      //load iris training and testing data
      const hep = require("../hep.json");
      // convert/setup our data for tensorflow.js
      //tensor of features for training data
      console.log("trainingData");
      const trainingData = tf.tensor2d(
        hep.map((item) => [
          item.Age,
          item.Sex,
          item.Steroid,
          item.Antivirals,
          item.Fatigue,
          item.Malaise,
          item.Anorexia,
          item.Liver_big,
          item.Liver_firm,
          item.Spleen_palpable,
          item.Spiders,
          item.Ascites,
          item.Varices,
          item.Bilurubin,
          item.Alk_phosphate,
          item.Sgot,
          item.Albumin,
          item.Protime,
          item.Histology,
        ])
      );
      //tensor of output for training data
      //console.log(trainingData.dataSync())
      //
      //tensor of output for training data
      //the values for species will be:
      // Die_Live 1:       1,0 //live
      // Die_Live 2:       0,1 //die
      const outputData = tf.tensor2d(
        hep.map((item) => [
          item.Die_Live === 1 ? 1 : 0,
          item.Die_Live === 2 ? 1 : 0,
        ])
      );
      console.log("Output Data: ---------");
      console.log(outputData.dataSync());
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

      // build neural network using a sequential model
      const model = tf.sequential();
      //add the first layer
      model.add(
        tf.layers.dense({
          inputShape: [19], // 19 input neurons (features)
          activation: "sigmoid",
          units: 30, //dimension of output space (first hidden layer)
        })
      );
      //add the first hidden layer
      model.add(
        tf.layers.dense({
          inputShape: [30], //dimension of hidden layer (2/3 rule)
          activation: "sigmoid",
          units: 16, //dimension of second hidden layer
        })
      );
      //add the second hidden layer
      model.add(
        tf.layers.dense({
          inputShape: [15], //dimension of hidden layer (2/3 rule)
          activation: "sigmoid",
          units: 2, //dimension of final output (die or live)
        })
      );
      //add output layer
      model.add(
        tf.layers.dense({
          activation: "sigmoid",
          units: 2, //dimension of final output
        })
      );
      //compile the model with an MSE loss function and Adam algorithm
      model.compile({
        //categoricalCrossentropy
        loss: "meanSquaredError",
        optimizer: tf.train.adam(0.003), //is a new algorithm
        metrics: ["accuracy"],
      });
      console.log(model.summary());
      // train/fit the model for the fixed number of epochs
      const startTime = Date.now();
      //
      async function run() {
        const startTime = Date.now();
        //train the model using fit method
        await model.fit(trainingData, outputData, {
          epochs: 1000, //number of iterations
          callbacks: {
            onEpochEnd: async (epoch, log) => {
              console.log(`Epoch ${epoch}: loss = ${log.loss}`);
              elapsedTime = Date.now() - startTime;
              console.log("elapsed time: " + elapsedTime);
            },
          },
        }); //fit
        // predict using predict method
        const results = model.predict(inputData);
        results.print();
        // get the values from the tf.Tensor
        //var tensorData = results.dataSync();
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
        const resultsArray = await results.array();
        console.log(resultsArray);
        var resultForData1 = resultsArray[0];
        const dataToSend = {
          resultsArray: resultForData1,
        };
        console.log(dataToSend);
        return dataToSend;
      } //end of run function
      return await run();
      //
    },
  },
};

module.exports = {
  aiQuery: queryType,
};
