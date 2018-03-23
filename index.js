#!/usr/bin/env node --harmony

/**
 * Importing Modules
 */
const program = require('commander');
const prompt = require('co-prompt');
const ProgressBar = require('progress');
const fs = require('fs');
const SVN = require('./modules/Svn');
const chalk = require('chalk');
const log = console.log;

/**
 * Program Logic
 */
program
    .version('0.0.1', '-v --version')
    .description('A CLI for handling WordPress SVN functions.')
    .option('-h, --help', null, {noHelp: true});

program
    .description('SVN functions, like tag, push, etc.')
    .command('svn [command]', null, {noHelp: true})
    .option('-m, --message <message>', null, {noHelp: true})
    .option('-h, --help', null, {noHelp: true})
    .action(function(command, options) {
        let s = new SVN(command, options);
        s.parse();
    });

program
    .command('*')
    .action(function(env){
        log('deploying "%s"', env);
    });

program.parse(process.argv);
