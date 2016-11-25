const { graphql, buildSchema } = require('graphql')
const { makeExecutableSchema } = require('graphql-tools')



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
    name: 'Lista 2'
  }
]

// Construct a schema, using GraphQL schema language.
const schema = `
  type Query {
    hello: String
    tasks: [Task]
    task (id: Int!): Task
    lists: [List]
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
    tasks: [Task]
  }

  input TaskInput {
    text: String!
  }

  type Mutation {
    addTask (text: String): Task
    addList (name: String!, tasks: [TaskInput]): List
  }

  schema {
    query: Query
    mutation: Mutation
  }
`

const prepareTask = list => task => Object.assign(task, {
  id: tasks.length,
  status: false,
  list,
})

// The root provides a resolver function for each API endpoint.
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    lists: () => lists,
    tasks: () => tasks,
    task: ({ id }) => tasks.find(task => task.id === id),
  },

  Mutation: {
    addTask: (root, { text }) => {

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
    addList: (root, { name, tasks: newTasks = [] }) => {
      const newList = {
        name,
        id: lists.length,
      }

      lists.push(newList)

      newTasks
        .map(prepareTask(newList.id))
        .forEach(task => tasks.push(task))

      return newList
    }
  },

  Task: {
    list: task => lists.find(list => list.id === task.list)
  },

  List: {
    tasks: ({ id }) => tasks.filter(task => task.list === id)
  }
}

// Run the GraphQL query.
const query = `mutation {
  addList(name: "List 3", tasks: [{ text: "Task 3" }]) {
    name
  }
}
`

const exectableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers
})

graphql(exectableSchema, query).then(response => {
  console.log(JSON.stringify(response, null, 2))
})
