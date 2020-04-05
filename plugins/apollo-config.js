export default function() {
  return {
    httpEndpoint: 'https://graphql.fauna.com/graphql',
    getAuth: () => 'Bearer ' + process.env.faunaSecret
  }
}
