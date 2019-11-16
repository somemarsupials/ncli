import * as test from "tape";

import { CommandDefinition } from "../src/interfaces";
import { parseCommandDefinition } from "../src/parser";

const singleCommand: CommandDefinition = {
  flags: ["flag-a", "flag-b"],
  parameters: { "param-a": "string" }
};

const nestedCommand: CommandDefinition = {
  subcommands: {
    start: {
      flags: ["flag-a", "flag-b"],
      parameters: { "param-a": "string" }
    },
    stop: {
      flags: [],
      parameters: {}
    }
  }
};

const doublyNestedCommand: CommandDefinition = {
  subcommands: {
    start: {
      subcommands: {
        stop: {
          flags: ["flag-a", "flag-b"],
          parameters: { "param-a": "string" }
        }
      }
    }
  }
};

test("it can parse single command", t => {
  const command = parseCommandDefinition(singleCommand, [
    "--flag-a",
    "--flag-b",
    "--param-a",
    "value",
    "argument"
  ]);

  t.same(command, {
    isNamed: false,
    args: ["argument"],
    flags: ["flag-a", "flag-b"],
    parameters: { "param-a": "value" }
  });

  t.end();
});

test("it can parse nested command", t => {
  const command = parseCommandDefinition(nestedCommand, [
    "start",
    "--flag-a",
    "--flag-b",
    "--param-a",
    "value",
    "argument"
  ]);

  t.same(command, {
    args: ["argument"],
    isNamed: true,
    flags: ["flag-a", "flag-b"],
    name: "start",
    path: "start",
    parameters: { "param-a": "value" }
  });

  t.end();
});

test("it can parse doubly-nested command", t => {
  const command = parseCommandDefinition(doublyNestedCommand, [
    "start",
    "stop",
    "--flag-a",
    "--flag-b",
    "--param-a",
    "value",
    "argument"
  ]);

  t.same(command, {
    args: ["argument"],
    isNamed: true,
    flags: ["flag-a", "flag-b"],
    name: "stop",
    path: "start.stop",
    parameters: { "param-a": "value" }
  });

  t.end();
});
