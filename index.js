const { graphql, buildSchema } = require('graphql')

// Construct a schema, using GraphQL schema language.
const schema = buildSchema(`
  type Query {
    hello: String
    tasks: [Task]
    task (id: Int!): Task
  }

  type Task {
    id: Int!
    text: String
    status: Boolean
  }
`)

const tasks = [
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
}

// Run the GraphQL query.
const tasksQuery = `{
  tasks {
    id
    text
    status
  }

  task(id: 1) {
    id
    text
    status
  }
}`

graphql(schema, tasksQuery, resolvers).then(response => {
  console.log(JSON.stringify(response, null, 2))
})
