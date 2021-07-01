const Express = require("express")
const router = Express.Router()
let validateJWT = require("../middleware/validate-jwt")
const {
    LogModel
} = require("../models")
const Log = require("../models/log")

router.get('/practice', validateJWT, (req, res) => {
    res.send('Hey!! This is a practice route!')
})
//! Create workout entries
router.post("/log/", validateJWT, async (req, res) => {
    const {
        description,
        definition,
        results
    } = req.body.workoutEntry
    const {
        id
    } = req.user
    const workoutEntry = {
        description,
        definition,
        results,
        owner: id
    }
    try {
        const newWorkout = await LogModel.create(workoutEntry)
        res.status(200).json(newWorkout)
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
})

//! Get workouts by user
router.get("/log", validateJWT, async (req, res) => {
    const {
        id
    } = req.user
    try {
        const userEntries = await LogModel.findAll({
            where: {
                owner: id
            }
        })
        res.status(200).json(userEntries)
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
})

//! Get logs by ID for individual user
router.get("/log/:id"), validateJWT, async (req, res) => {
    const {
        id
    } = req.user

    const logID = req.params.id
    
    try {
        const getLog = await LogModel.findOne({
            where: {
                id: logID,
                owner: id
            }
        })
        res.status(200).json(getLog)
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}


//! Allows individual logs to be updated by user
router.put("/log/:id", validateJWT, async (req, res) => {
    try {
        const WorkoutID = req.params.id
        const {
            description,
            definition,
            results
        } = req.body.workoutEntry

        const query = {
            where: {
                id: WorkoutID
            }
        }

        const updatedWorkout = {
            description,
            definition,
            results
        }

        const WorkoutUpdated = await Log.update(updatedWorkout, query)
        res.status(200).json({
            WorkoutUpdated
        })
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
})

//! Allows individual logs to be deleted by a user
router.delete("/log/:id", validateJWT, async (req, res) => {
    try {
        const WorkoutID = req.params.id
        const logID = req.user.id
        const query = {
            where: {
                id: WorkoutID,
            }
        }

        let logRemoved = await Log.destroy(query)

        if (logRemoved) {
            res.status(200).json({
                message: "Log Removed"
            })
        } else {
            res.status(404).json({
                message: "Workout log not found in database"
            })
        }

    } catch (error) {
        res.status(500).json({
            message: `Error: ${error}`
        })
    }
})

module.exports = router