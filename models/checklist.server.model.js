

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
    breathing: {
        type: Boolean,
    },
    bodyAches: {
        type: Boolean,
    },
    headache: {
        type: Boolean,
    },
    smell: {
        type: Boolean
    },
    sorethroat: {
        type: Boolean,
    },
    runnynose: {
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