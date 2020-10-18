module.exports = {
  client: {
    service: {
      url: "http://localhost:4000/graphql",
      // to point a local schema file
      // localSchemaFile: path-to-file
      skipSSLValidation: true,
    },
  },
};
