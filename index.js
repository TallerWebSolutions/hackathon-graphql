const { graphql, buildSchema } = require('graphql')

// Construct a schema, using GraphQL schema language.
const schema = buildSchema(`
  type Query {
    hello: String
    tasks: [Task]
    task (id: Int!): Task
    addTask (text: String) : Task
  }

  type Task {
    id: Int!
    text: String
    status: Boolean
  }
`)

let tasks = [
  {
    id: 1,
    text: 'Tarefa 1',
    status: false
  },
  {
    id: 2,
    text: 'Tarefa 2',
    status: true
  }
]

// The root provides a resolver function for each API endpoint.
const resolvers = {
  hello: () => {
    return 'Hello world!'
  },
  tasks: () => {
    return tasks
  },
  task: ({ id }) => {
    return tasks.find(task => task.id === id)
  },
  addTask: ({ text }) => {

    // Procedural way.
    // const newItem = {
    //   id: tasks.length+1,
    //   text,
    //   status: false,
    // }
    //
    // tasks.push(newItem)
    //
    // return newItem

    // Best way :P
    tasks = tasks.concat({
      id: tasks.length+1,
      text,
      status: false,
    })

    return tasks[tasks.length-1]
  }
}

// Run the GraphQL query.
const tasksQuery = `{

  tasksBefore: tasks {
    id
    text
    status
  }

  task(id: 1) {
    id
    text
    status
  }

  addTask(text: "Nova task" ) {
    id
    text
    status
  }

  tasks {
    id
    text
    status
  }
}`

graphql(schema, tasksQuery, resolvers).then(response => {
  console.log(JSON.stringify(response, null, 2))
})
