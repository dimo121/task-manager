// CRUD create read update delete

// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID

//may use destructuring as a substitute for above
const { MongoClient, ObjectID } = require('mongodb')

//const assert = require('assert')

const connectionURL = 'mongodb://127.0.0.1:27017' 
const databaseName = 'task-manager'

//parser and topology set due to deprecation
MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology : true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database')
    }

    const db = client.db(databaseName)

    //delete one or many documents with the below

    // db.collection('tasks').deleteOne({ 
    //     description: 'homework' 
    // }).then((result) => {
    //     console.log(result.deletedCount)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // db.collection('tasks').updateMany({},{$set: { completed : true }}).then((result) => {
    //     console.log(result)
    //     console.log('Success!')
    // }).catch((error) => {
    //     console.log(error)
    // })

    //update documents using updateOne or updateMany

    // db.collection('tasks').updateOne({_id: new ObjectID('5ebf96143a10a1263489379b')}, { 
    //     $inc : {
    //         description: 'coffee machine repairs',
    //         completed: true
    //         }
    //     }).then((result) => {
    //     if(result.modifiedCount == 1){
    //         console.log("Success!!")    
    //         console.log('document updated succesfully')
    //     } else {
    //         console.log('Other')
    //     }
    // }).catch((error) => console.log(error, ' document not updated'))

    //read documents using find (returns cursor) or findOne

    // db.collection('tasks').findOne({_id: new ObjectID('5ebf96143a10a1263489379b')}, (error,task) => {
    
    //     if(error){
    //         return console.log('Unable to fetch')
    //     }

    //     console.log(task)
    // })

    // db.collection('tasks').find({completed: true}).toArray((error,docs) => {
    //     console.log(docs)
    // })

    //insert one or multiple documents below

    // db.collection('users').insertOne({
    //     name : 'Vikram',
    //     age : 26
    // }, (error,result) => {
    //     if(error) {
    //         return console.log('Unable to insert document')
    //     }

    //     console.log(result.ops)
    // })

    // db.collection('users').insertMany([
    //     {
    //         name: 'Amy',
    //         age: 25
    //     },
    //     {
    //         name: 'Gunther',
    //         age: 30
    //     }
    // ], (error,result) => {
    //     if (error){
    //         return console.log('Unable to insert documents')
    //     }

    //     console.log(result.ops)
    // })

    // db.collection('tasks').insertMany([
    //     {
    //         description : '5km jog',
    //         completed: false
    //     },
    //     {
    //         description: 'homework',
    //         completed: true
    //     },
    //     {
    //         description : 'repair coffee machien',
    //         completed: true
    //     }
    // ], (error,result) => {
    //     if(error){
    //         console.log('Unable to insert documents')
    //     }

    //     console.log(result.ops)
    // })

})  

