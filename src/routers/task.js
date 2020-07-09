const auth = require('../middleware/auth')
const express = require('express')
const router = new express.Router()
const Task = require('../models/task')

// GET /tasks?completed=false
// pagination using limit skip GET /tasks?limit=10&skip=10 (gives 10 to 20)
router.get('/tasks', auth, async (req,res) => {
    const match = {}
    const sort = {}

    if (req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    
    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/tasks/:id', auth, async (req,res) => {
    const _id = req.params.id
    
    try {
        const task = await Task.findOne({_id, owner: req.user._id})

        //below also works
        // await req.user.populate('tasks').execPopulate()

        // const task = req.user.tasks.find((item) => item._id == _id)
              
        if(!task){
            return res.status(404).send({
                message: "404 - task with given id not found"
            })
        }

        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})


router.patch('/tasks/:id', auth, async (req,res) => {
    
    const updates = Object.keys(req.body)
    const allowedUpdates = ['completed', 'description']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({ error : "Invalid update request"})
    }

    try {
        const task = await Task.findOne( {_id: req.params.id, owner: req.user._id })
        //const task = await Task.findById(req.params.id)

        if(!task){
            return res.status(404).send('No match for user and task id')
        }

        updates.forEach((update) => task[update] = req.body[update])

        await task.save()

        res.send(task)

    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/tasks', auth, async (req,res) => {   
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    //const task = new Task(req.body)
    try {
        
        await task.save()
        res.status(201).send(task)
    } catch(e) {
        res.status(400).send(e)
    }
})


router.delete('/tasks/:id', auth, async (req,res) => {
    try{
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        
        if(!task){
            return res.status(404).send('404 - Task not found')
        }
        
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router