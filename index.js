#!/usr/bin/env node

import "./commands/document.js";
import "./commands/mailing.js";
import program from "./lib/program.js";

program.parse();
