This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

<br/>

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

<br/>

## GraphQL Codegen

Add queries and mutations under `src/graphql/queries` and `src/graphql/mutations`.

Ensure your core-api is running.

Use codegen to generate GraphQL hooks and typescript types:

```
npm run codegen:coreapi
```
