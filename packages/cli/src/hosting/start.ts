import { checkDockerConfigured, checkInitComplete, handleError } from "./utils"
import { info, success } from "../utils"
import * as makeFiles from "./makeFiles"
import compose from "docker-compose"
import fs from "fs"
import { confirmation } from "../questions"
const open = require("open")

export async function start() {
  await checkDockerConfigured()
  checkInitComplete()
  console.log(
    info(
      "Starting services, this may take a moment - first time this may take a few minutes to download images."
    )
  )
  let port
  if (fs.existsSync(makeFiles.ENV_PATH)) {
    port = makeFiles.getEnvProperty("MAIN_PORT")
  } else {
    port = makeFiles.getComposeProperty("port")
  }
  await handleError(async () => {
    // need to log as it makes it more clear
    await compose.upAll({ cwd: "./", log: true })
  })
  if (await confirmation(`Do you wish to open http://localhost:${port} ?`)) {
    await open(`http://localhost:${port}`)
  }
  console.log(
    success(
      `Services started, please go to http://localhost:${port} for next steps.`
    )
  )
}
