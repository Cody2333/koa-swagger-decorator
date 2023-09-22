export interface SwaggerHTMLConfig {
  "swagger-ui-bundle": string;
  "swagger-ui-css": string;
}
const swaggerHTML = (
  apiPath: string,
  config: SwaggerHTMLConfig = {
    "swagger-ui-bundle":
      "https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-bundle.js",
    "swagger-ui-css": "https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui.css",
  }
) => {
  const result = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta
      name="description"
      content="SwaggerUI"
    />
    <title>SwaggerUI</title>
    <link rel="stylesheet" href="${config["swagger-ui-css"]}" />
  </head>
  <body>
  <div id="swagger-ui"></div>
  <script src="${config["swagger-ui-bundle"]}" crossorigin></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '${apiPath}',
        dom_id: '#swagger-ui',
      });
    };
  </script>
  </body>
  </html>

`;
  return result;
};
export default swaggerHTML;
export { swaggerHTML };
