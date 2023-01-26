const { SuppressLLM, DataGenerator, SuppresServer } = require('ai.suppress.js');

const llm = new SuppressLLM(mySecret);
llm
const server = new SuppresServer();
// output format for a report on a historical moment
const outputFormat = `<h1>{event name}</h1>
<span>{event date</span>
<p>{description}</p>
<h2>Related Locations</h2>
<ul>
    <li>{location}</li>
    ...
</ul>
<h2>Related People</h2>
<ul>
    <li>{person}</li>
    ...
</ul>

<h2>Related Organizations</h2>
<ul>
    <li>{organization}</li>
    ...
</ul>

<h2>Related Events</h2>
<ul>
    <li>{event}</li>
    ...
</ul>
`
let generator = new DataGenerator(
    "Create a report on the historical moment: {eventName}. In this report you will find the date, description, related locations, people, organizations and events.",
    outputFormat,
    llm
  )
generator.parseJson = false;
server.createEndpoint(
  "/report/event/",
  "GET-query",
  generator
);
server.app.get("/", (req, res) => {
  res.send(`
  <form action="/report/event/" method="get">
    Event Name: <input type="text" name="eventName">
    <input type="submit" value="Submit">
  </form>
  `)
})
server.start(3000)
