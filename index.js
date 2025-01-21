const express = require("express");
const cors = require("cors");

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const port = 3000

const app = express();

app.use(cors());

app.get("/jobstats", async (req, res) => {
    console.log("All jobsites accessed")
    const site = `https://www.cwjobs.co.uk/jobs/in-south-east`
    try{
        const result = await numberOfJobs(site)
        const data = {
            label: "all",
            value: result
        }
        res.status(200).send(data)
        console.log("Returned: " + data)
    } catch(err) {
        res.status(500).send({error: err})
    }
});

app.get("/jobstats/:keyword", async (req, res) => {

    const jobTitle = req.params.keyword

    const site = `https://www.cwjobs.co.uk/jobs/${jobTitle}/in-south-east`
    try{
        const result = await numberOfJobs(site)
        const data = {
            label: jobTitle,
            value: result
        }
        res.status(200).send(data)
    } catch(err) {
        res.status(500).send({error: err})
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

async function numberOfJobs (address) {
    //Gather data from site and add to a DOM
    const dom = await JSDOM.fromURL(address)
    //Find total jobs listed from page, is contained in <span class="at-facet-header-total-results">20</span>
    const element = dom.window.document.querySelector('span.at-facet-header-total-results')
    try{
        return parseInt(element.innerHTML.replace(/,/g, ''))
    } catch {
        return 0
    }
}
