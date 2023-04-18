

const mongoose = require("mongoose");

const Checklist = mongoose.Schema({
    fever: {
        type: Boolean,
    },
    cough: {
        type: Boolean,
    },
    fatigue: {
        type: Boolean,
    },
    bodyAches: {
        type: Boolean,
    },
    headache: {
        type: Boolean,
    },
    lossTastesSmell: {
        type: Boolean
    },
    soreThroat: {
        type: Boolean,
    },
    runnyNose: {
        type: Boolean,
    },
    vomiting: {
        type: Boolean,
    },
    diarrhea: {
        type: Boolean,
    }
});
module.exports = mongoose.model("Checklist", Checklist)