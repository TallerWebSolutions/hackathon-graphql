const { graphql, buildSchema } = require('graphql')

// Construct a schema, using GraphQL schema language.
const schema = buildSchema(`
  type Query {
    hello: String
    tasks: [Task]
    task (id: Int!): Task
    lists: List
  }

  type Task {
    id: Int!
    text: String
    status: Boolean
    list: List
  }

  type List {
    id: Int!
    name: String
  }

  type Mutation {
    addTask (text: String) : Task
  }
`)

let tasks = [
  {
    id: 1,
    text: 'Tarefa 1',
    status: false,
    list: 1
  },
  {
    id: 2,
    text: 'Tarefa 2',
    status: true,
    list: 2
  },
  {
    id: 3,
    text: 'Tarefa 3',
    status: true,
    list: 1
  }
]

let lists = [
  {
    id: 1,
    name: 'Lista 1',
  },
  {
    id: 2,
    name: 'Lista 2',
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
  },
  Task: (args) => {
    console.log(args)
    process.exit()
  },
  lists: (args) => {
    console.log(args)
    return lists[0]
  },
  list: (args) => {
    console.log(args)
    return lists[0]
  }

}

// Run the GraphQL query.
const tasksQuery = `query {

  tasks {
    id
    text
    status
    list {
      id
      name
    }
  }

  lists {
    id
    name
  }

}`

const tasksMutation = `mutation {

  addTask(text: "Nova task" ) {
    id
    text
    status
  }

}`

graphql(schema, tasksQuery, resolvers).then(response => {
  console.log(JSON.stringify(response, null, 2))
})
