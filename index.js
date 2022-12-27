import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import products from './products.js';

const app = express();

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    message: String
    product(id: Int!): Product
    products: [Product]
  }

  type Product {
    id: Int
    name: String
    slug: String
    price: Int
    stock: Int
    qty: Int
  }

  type Mutation {
    addProduct(name: String!, price: Int!, stock: Int!): Product
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
  message: () => 'Hello world!',
  products: () => products,
  product: ({ id }) => products.find((product) => product.id === id),
  addProduct: ({ name, price, stock }) => {
    const id = products.length + 1;
    const slug = name.toLowerCase().replace(/ /g, '-');
    const product = { id, name, slug, price, stock, qty: 0 };
    products.push(product);
    return product;
  },
};

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
    rootValue: root,
  })
);

app.listen(4000, () => console.log('Server is running on port 4000'));
